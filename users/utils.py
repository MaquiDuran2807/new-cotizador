import secrets
import string

from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth import get_user_model


UserModel = get_user_model()


class _ForcePasswordResetForm(PasswordResetForm):
    def get_users(self, email):
        return UserModel._default_manager.filter(email__iexact=email)


def normalize_email(email):
    return (email or '').strip().lower()


def username_from_email(email, model, max_length=50):
    normalized_email = normalize_email(email)
    local_part = normalized_email.split('@', 1)[0].strip()
    base_username = local_part[:max_length] or 'usuario'
    candidate = base_username
    suffix = 1

    while model.objects.filter(username__iexact=candidate).exists():
        suffix_text = str(suffix)
        trimmed_base = base_username[: max_length - len(suffix_text)]
        candidate = f'{trimmed_base}{suffix_text}'
        suffix += 1

    return candidate


def initial_password(length=12):
    alphabet = string.ascii_letters + string.digits + '!@#$%&*?'
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def social_profile_names(extra_data, username):
    full_name = (extra_data.get('name') or '').strip()
    given_name = (extra_data.get('given_name') or '').strip()
    family_name = (extra_data.get('family_name') or '').strip()

    if full_name and (not given_name or not family_name):
        name_parts = full_name.split()
        if not given_name:
            given_name = name_parts[0]
        if not family_name and len(name_parts) > 1:
            family_name = ' '.join(name_parts[1:])

    if not given_name:
        given_name = username.replace('.', ' ').replace('_', ' ').title()

    if not family_name:
        family_name = username.replace('.', ' ').replace('_', ' ').title()

    telephone = extra_data.get('phone_number')

    return given_name, family_name, telephone


def send_credentials_email(request, user, raw_password=None, title='Tu cuenta CodenSolar',
                           subject_template_name='registration/password_reset_subject.txt',
                           email_template_name='registration/password_reset_social_email.html'):
    extra = {'raw_password': raw_password} if raw_password else {}
    form = _ForcePasswordResetForm({'email': user.email})
    if not form.is_valid():
        return
    form.save(
        request=request,
        use_https=request.is_secure(),
        subject_template_name=subject_template_name,
        email_template_name=email_template_name,
        extra_email_context=extra,
    )