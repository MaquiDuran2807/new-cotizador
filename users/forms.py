from django import forms
from django.contrib.auth import authenticate
from django.contrib import messages
#
from .models import User

class UserRegisterForm(forms.ModelForm):

    username = forms.CharField(
        label='Nombre de usuario',
        required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Nombre de usuario'
            }
        )
    )

    password1 = forms.CharField(
        label='Contraseña',
        required=True,
        widget=forms.PasswordInput(
            
        )
    )
    password2 = forms.CharField(
        label='Contraseña',
        required=True,
        widget=forms.PasswordInput(
            
        )
    )

    class Meta:
        """Meta definition for Userform."""

        model = User
        fields = (
            'username',
            'email',
            'name',
            'lastname',
            'telephone',
        )
    
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            self.add_error('password2', 'Las contraseñas no son iguales')
        return password2



class LoginForm(forms.Form):
    username = forms.CharField(
        label='username',
        required=True,
        widget=forms.TextInput(
           
        )
    )
    password = forms.CharField(
        label='Contraseña',
        required=True,
        widget=forms.PasswordInput(

    ))
    

    def clean(self):
        cleaned_data = super(LoginForm, self).clean()
        login_value = cleaned_data.get('username', '').strip()
        password = cleaned_data.get('password')

        user = authenticate(username=login_value, password=password)
        if not user:
            user = authenticate(username=login_value.lower(), password=password)

        if not user:
            from .models import User
            matched_user = User.objects.filter(username__iexact=login_value).first()
            if matched_user:
                user = authenticate(username=matched_user.email, password=password)

        if not user:
            raise forms.ValidationError('Los datos de usuario no son correctos')

        self.user = user
        
        return self.cleaned_data


class UpdatePasswordForm(forms.Form):

    password1 = forms.CharField(
        label='Contraseña Actual',
        required=False,
        widget=forms.PasswordInput(
            attrs={
                'placeholder': 'Contraseña Actual'
            }
        )
    )
    password2 = forms.CharField(
        label='Contraseña Nueva',
        required=True,
        widget=forms.PasswordInput(
            attrs={
                'placeholder': 'Contraseña Nueva'
            }
        )
    )

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def clean_password1(self):
        password = self.cleaned_data.get('password1', '')
        if self.user:
            has_social = self.user.socialaccount_set.exists()
            if not has_social:
                if not password:
                    raise forms.ValidationError('Debes ingresar tu contraseña actual')
                if not self.user.check_password(password):
                    raise forms.ValidationError('La contraseña actual no es correcta')
        return password

    def clean_password2(self):
        password = self.cleaned_data.get('password2', '')
        if len(password) < 6:
            raise forms.ValidationError('La contraseña debe tener al menos 6 caracteres')
        return password


class VerificationForm(forms.Form):
    codregistro = forms.CharField(required=True)


    def __init__(self, pk, *args, **kwargs):
        self.id_user = pk
        super(VerificationForm, self).__init__(*args, **kwargs)

    def clean_codregistro(self):
        codigo = self.cleaned_data['codregistro']
        # eliminar esacios 
        codigo = codigo.replace(' ', '')

        if len(codigo) == 6:
            # verificamos si el codigo y el id de usuario son validos:
            activo = User.objects.cod_validation(
                self.id_user,
                codigo
            )
            if not activo:
                raise forms.ValidationError('el codigo es incorrecto')
        else:
            raise forms.ValidationError('el codigo es incorrecto')
        
class ForgotPasswordForm(forms.Form):
    email = forms.CharField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Email'
            }
        )
    )

    def clean_email(self):
        email = self.cleaned_data['email']
        if not User.objects.filter(email=email).exists():
            raise forms.ValidationError('El email no existe')
        return email