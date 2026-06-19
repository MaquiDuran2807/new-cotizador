from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

from .utils import initial_password, normalize_email, social_profile_names, username_from_email


class CodensolarAccountAdapter(DefaultAccountAdapter):
    def populate_username(self, request, user):
        user_model = get_user_model()
        email = normalize_email(getattr(user, 'email', ''))
        if not email:
            return super().populate_username(request, user)

        if not user.username:
            user.username = username_from_email(email, user_model)
        return user.username


class CodensolarSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        user_model = get_user_model()
        data = sociallogin.account.extra_data or {}
        email = normalize_email(data.get('email') or sociallogin.user.email)

        if email:
            user = user_model.objects.filter(email__iexact=email).first()
            if user:
                changed = False
                if not user.username:
                    user.username = username_from_email(email, user_model)
                    changed = True

                given_name, family_name, telephone = social_profile_names(data, user.username)
                if given_name and not user.name:
                    user.name = given_name
                    changed = True
                if family_name and not user.lastname:
                    user.lastname = family_name
                    changed = True
                if telephone and not user.telephone:
                    user.telephone = telephone
                    changed = True
                if not user.is_active:
                    user.is_active = True
                    changed = True
                if changed:
                    user.save()
                sociallogin.connect(request, user)

        return super().pre_social_login(request, sociallogin)

    def is_auto_signup_allowed(self, request, sociallogin):
        return True

    def populate_user(self, request, sociallogin, data):
        user_model = get_user_model()
        user = super().populate_user(request, sociallogin, data)
        email = normalize_email(data.get('email') or user.email)
        user.email = email

        if not user.username:
            user.username = username_from_email(email, user_model)

        extra = sociallogin.account.extra_data or {}
        given_name, family_name, telephone = social_profile_names(extra, user.username)
        if not user.name:
            user.name = given_name
        if not user.lastname:
            user.lastname = family_name
        if telephone is not None:
            user.telephone = telephone

        user.is_active = True
        user.set_password(initial_password())
        return user