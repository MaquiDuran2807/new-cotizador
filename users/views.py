

# Create your views here.
from django.shortcuts import render
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.urls import reverse_lazy, reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
# importar raise_exception




from django.views.generic import (
    View,
    CreateView
)

from django.views.generic.edit import (
    FormView
)
from django.contrib.auth.views import PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
from django.conf import settings

from .forms import (
    UserRegisterForm, 
    LoginForm,
    UpdatePasswordForm,
    VerificationForm,ForgotPasswordForm
)
#
from .models import User
# 
from .functions import code_generator
from django.contrib import messages

from .utils import username_from_email
from .utils import send_credentials_email


class UserRegisterView(FormView):
    template_name = 'users/Vlogin.html'
    form_class = UserRegisterForm
    success_url = '/'

    def form_valid(self, form):
        # generamos el codigo
        codigo = code_generator()
        email = form.cleaned_data['email']
        username = form.cleaned_data['username']
        raw_password = form.cleaned_data['password1']
        #
        usuario = User.objects.create_user(
            email=email,
            password=raw_password,
            username=username,
            name=form.cleaned_data['name'],
            lastname=form.cleaned_data['lastname'],
            telephone=form.cleaned_data['telephone'],
            codregistro=codigo,
            is_active=False,
        )
       
        # enviar el codigo al email del user
        asunto = 'Confrimacion de email'
        mensaje = 'Codigo de verificacion: ' + codigo
        email_remitente = 'comercial@codensolar.com'
        usuario_new = [form.cleaned_data['email']]
        print(usuario_new)

        
        email = EmailMessage(asunto, mensaje, email_remitente, [form.cleaned_data['email']])
        email.send()        
        send_credentials_email(self.request, usuario, raw_password=raw_password, title='Alta de cuenta CodenSolar')
        #
        #send_mail(asunto, mensaje, email_remitente, [form.cleaned_data['email'],])
        # redirigir a pantalla de valdiacion
        messages.success(self.request, 'Usuario creado correctamente')

        return HttpResponseRedirect(
            reverse(
                'users_app:user-verification',
                kwargs={'pk': usuario.id}
            )
        )
    
    def form_invalid(self, form):
        messages.error(self.request, 'Error al registrar el usuario')
        return super().form_invalid(form)



class LoginUser(FormView):
    template_name = 'users/login1.html'
    form_class = LoginForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['next_url'] = self.request.GET.get('next') or self.request.POST.get('next') or ''
        context['google_login_enabled'] = bool(getattr(settings, 'SOCIALACCOUNT_PROVIDERS', {}).get('google', {}).get('APP', {}).get('client_id'))
        return context

    def get_success_url(self):
        next_url = self.request.GET.get('next') or self.request.POST.get('next')
        if next_url:
            return next_url
        return reverse('Products_app:cotizador-solar')

    def form_invalid(self, form):
        for field, errors in form.errors.items():
            for error in errors:
                messages.error(self.request, error)
        return super().form_invalid(form)

    def form_valid(self, form):
        user = getattr(form, 'user', None)
        print(user, '------------------')
        login(self.request, user)
        return super(LoginUser, self).form_valid(form)


class LogoutView(View):

    def get(self, request, *args, **kargs):
        logout(request)
        return HttpResponseRedirect(
            reverse(
                'users_app:user-login'
            )
        )
    
class ForgotpasswordView(PasswordResetView):
    template_name = 'users/update.html'
    email_template_name = 'registration/password_reset_email.html'
    subject_template_name = 'registration/password_reset_subject.txt'
    success_url = reverse_lazy('users_app:password-reset-done')


class PasswordResetDone(PasswordResetDoneView):
    template_name = 'users/password_reset_done.html'


class PasswordResetConfirm(PasswordResetConfirmView):
    template_name = 'users/password_reset_confirm.html'
    success_url = reverse_lazy('users_app:password-reset-complete')


class PasswordResetComplete(PasswordResetCompleteView):
    template_name = 'users/password_reset_complete.html'

        


class UpdatePasswordView(LoginRequiredMixin, FormView):
    template_name = 'users/update.html'
    form_class = UpdatePasswordForm
    success_url = reverse_lazy('users_app:user-login')
    login_url = reverse_lazy('users_app:user-login')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        user = self.request.user
        new_password = form.cleaned_data['password2']
        user.set_password(new_password)
        user.save()
        messages.success(self.request, 'Contraseña cambiada correctamente. Inicia sesión de nuevo.')
        logout(self.request)
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'Error al cambiar la contraseña. Verifica los datos.')
        return super().form_invalid(form)


class CodeVerificationView(FormView):
    template_name = 'users/activate.html'
    form_class = VerificationForm
    success_url = '/user/login'
    

    def get_form_kwargs(self):
        kwargs = super(CodeVerificationView, self).get_form_kwargs()
        kwargs.update({
            'pk': self.kwargs['pk'],
        })
        return kwargs

    def form_valid(self, form):
        #
        User.objects.filter(
            id=self.kwargs['pk']
        ).update(
            is_active=True
        )
        
        
        
        return  super(CodeVerificationView, self).form_valid(form)