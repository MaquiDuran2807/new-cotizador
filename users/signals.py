from allauth.account.signals import user_signed_up
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

from .utils import send_credentials_email


@receiver(user_signed_up)
def mark_pending_credentials(request, user, **kwargs):
    if request is None:
        return
    request.session['_pending_social_credentials'] = True


@receiver(user_logged_in)
def send_social_signup_credentials(request, user, **kwargs):
    if request is None:
        return
    if request.session.pop('_pending_social_credentials', False):
        send_credentials_email(
            request,
            user,
            raw_password=None,
            title='Cuenta creada con Google en CodenSolar',
            subject_template_name='registration/password_reset_social_subject.txt',
        )