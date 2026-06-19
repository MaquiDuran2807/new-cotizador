from django.urls import path
from .views import (
    UserRegisterView,
    LoginUser,
    CodeVerificationView,
    LogoutView,
    UpdatePasswordView,
    ForgotpasswordView,
    PasswordResetDone,
    PasswordResetConfirm,
    PasswordResetComplete,
)

app_name = 'users_app'

urlpatterns = [
    path('login/register', UserRegisterView.as_view(), name='user-register'),
    path('login', LoginUser.as_view(), name='user-login'),
    path(
        'user-verification/<pk>/', 
        CodeVerificationView.as_view(),
        name='user-verification',
    ),
    path('logout', LogoutView.as_view(), name='user-logout'),
    path('update', UpdatePasswordView.as_view(), name='user-update'),
    path('forgotpassword', ForgotpasswordView.as_view(), name='user-forgotpassword'),
    path('password-reset/done/', PasswordResetDone.as_view(), name='password-reset-done'),
    path('password-reset/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('password-reset/complete/', PasswordResetComplete.as_view(), name='password-reset-complete'),

]