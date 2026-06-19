from django.test import TestCase, override_settings
from django.core import mail
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.test.client import RequestFactory
from allauth.account.signals import user_signed_up
from django.contrib.auth.signals import user_logged_in
from unittest.mock import patch

from .adapters import CodensolarSocialAccountAdapter
from .utils import send_credentials_email, initial_password

User = get_user_model()


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    ACCOUNT_EMAIL_VERIFICATION='none',
)
class SocialSignupPasswordResetTest(TestCase):
    """Test the complete social signup → password reset flow."""

    def setUp(self):
        self.factory = RequestFactory()
        self.request = self.factory.get('/accounts/google/login/callback/')
        self.request.session = self.client.session

    def test_full_social_signup_flow(self):
        """
        Simulates the complete social signup → email → link click → password change flow.
        """
        User = get_user_model()

        # Step 1: Create a user like social signup does
        user = User(
            username='testuser_google',
            email='testuser@gmail.com',
            name='Test',
            lastname='User',
            is_active=True,
        )
        user.set_password(initial_password())
        user.save()

        # Verify user has no last_login
        self.assertIsNone(user.last_login)

        # Step 2: Simulate user_signed_up signal (sets session flag)
        user_signed_up.send(
            sender=User,
            request=self.request,
            user=user,
        )
        self.assertTrue(
            self.request.session.get('_pending_social_credentials'),
            "Session flag should be set after user_signed_up"
        )

        # Step 3: Simulate auth_login (sets last_login)
        user.last_login = None  # Simulate what allauth does before login
        from django.utils import timezone
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        # Step 4: Simulate user_logged_in signal (sends email)
        user_logged_in.send(
            sender=User,
            request=self.request,
            user=user,
        )

        # Verify email was sent
        self.assertEqual(len(mail.outbox), 1, "Should have sent 1 email")
        email = mail.outbox[0]
        self.assertIn('testuser@gmail.com', email.to)
        self.assertIn('enlace', email.body)
        self.assertIn('password-reset', email.body)

        # Step 5: Extract the password reset link from email
        import re
        urls = re.findall(r'http[s]?://[^\s]+', email.body)
        self.assertTrue(len(urls) > 0, "Email should contain a URL")
        reset_url = urls[0]
        self.assertIn('password-reset', reset_url)

        # Parse uidb64 and token from the URL
        match = re.search(r'/user/password-reset/([^/]+)/([^/]+)/', reset_url)
        self.assertIsNotNone(match, "URL should match pattern")
        uidb64, token = match.group(1), match.group(2)

        # Step 6: Decode uidb64 and verify it matches the user
        uid = urlsafe_base64_decode(uidb64).decode()
        self.assertEqual(int(uid), user.pk)

        # Step 7: Verify the token is valid
        is_valid = default_token_generator.check_token(user, token)
        self.assertTrue(is_valid,
                        f"Token should be valid. uidb64={uidb64}, token={token}")

        # Step 8: Test the password reset confirm page
        response = self.client.get(f'/user/password-reset/{uidb64}/{token}/')
        self.assertEqual(response.status_code, 302, "Should redirect to set-password")

        # Follow the redirect
        response = self.client.get(f'/user/password-reset/{uidb64}/set-password/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Nueva contrase')
        self.assertContains(response, 'Cambiar contrase')

        # Step 9: Submit a new password
        response = self.client.post(
            f'/user/password-reset/{uidb64}/set-password/',
            {'new_password1': 'NuevaPass123!', 'new_password2': 'NuevaPass123!'}
        )
        self.assertEqual(response.status_code, 302, "Should redirect after password change")
        self.assertIn('complete', response.url)

        # Step 10: Verify the new password works
        user.refresh_from_db()
        self.assertTrue(user.check_password('NuevaPass123!'),
                        "New password should work")

        # Step 11: Test login with new password
        login_ok = self.client.login(email='testuser@gmail.com', password='NuevaPass123!')
        self.assertTrue(login_ok, "Should be able to login with new password")

    def test_normal_forgot_password_flow(self):
        """Verify the forgot password flow still works."""
        User = get_user_model()

        # Create test user
        user = User.objects.create_user(
            username='forgot_test',
            email='forgot_test@example.com',
            password='OldPass123!',
            name='Forgot',
            lastname='Test',
            is_active=True,
        )

        # Step 1: Submit forgot password form
        response = self.client.post('/user/forgotpassword', {'email': 'forgot_test@example.com'})
        self.assertEqual(response.status_code, 302)
        self.assertIn('done', response.url)

        # Step 2: Check email was sent
        self.assertEqual(len(mail.outbox), 1)
        email_body = mail.outbox[0].body
        self.assertIn('password-reset', email_body)

        # Step 3: Extract link and verify it works
        import re
        urls = re.findall(r'http[s]?://[^\s]+', email_body)
        reset_url = urls[0]
        match = re.search(r'/user/password-reset/([^/]+)/([^/]+)/', reset_url)
        uidb64, token = match.group(1), match.group(2)

        uid = urlsafe_base64_decode(uidb64).decode()
        self.assertEqual(int(uid), user.pk)

        is_valid = default_token_generator.check_token(user, token)
        self.assertTrue(is_valid, "Forgot password token should be valid")

        # Step 4: Navigate to reset page
        response = self.client.get(f'/user/password-reset/{uidb64}/{token}/')
        self.assertEqual(response.status_code, 302)
        response = self.client.get(f'/user/password-reset/{uidb64}/set-password/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Nueva contrase')

    def test_expired_token_shows_error(self):
        """Token from user_signed_up (before login) should be invalid."""
        User = get_user_model()

        user = User(
            username='expired_test',
            email='expired_test@gmail.com',
            name='Expired',
            lastname='Test',
            is_active=True,
        )
        user.set_password(initial_password())
        user.save()

        # Generate token BEFORE login (simulates old behavior)
        token = default_token_generator.make_token(user)

        # Simulate login (sets last_login)
        from django.utils import timezone
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        # The token generated before login should be invalid now
        is_valid = default_token_generator.check_token(user, token)
        self.assertFalse(is_valid,
                         "Token generated before login should be invalid")


class SocialProfileNamesTest(TestCase):
    """Test that social_profile_names correctly extracts names from Google data."""

    def test_uses_given_family_name_from_extra_data(self):
        from .utils import social_profile_names
        extra_data = {
            'email': 'miguel@gmail.com',
            'given_name': 'miguel angel',
            'family_name': 'quiroga duran',
            'name': 'miguel angel quiroga duran',
        }
        given, family, phone = social_profile_names(extra_data, 'miguel')
        self.assertEqual(given, 'miguel angel')
        self.assertEqual(family, 'quiroga duran')

    def test_falls_back_to_full_name_when_parts_missing(self):
        from .utils import social_profile_names
        extra_data = {
            'email': 'john@gmail.com',
            'name': 'John Smith',
        }
        given, family, phone = social_profile_names(extra_data, 'john')
        self.assertEqual(given, 'John')
        self.assertEqual(family, 'Smith')

    def test_falls_back_to_username_when_no_name_data(self):
        from .utils import social_profile_names
        extra_data = {'email': 'user@example.com'}
        given, family, phone = social_profile_names(extra_data, 'user')
        self.assertEqual(given, 'User')
        self.assertEqual(family, 'User')
