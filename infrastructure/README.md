# Despliegue en AWS Lightsail

## Requisitos

- Python 3.12+
- AWS CLI configurado: `aws configure`
- Terraform >= 1.5
- Ansible (se instala automáticamente con `pip install ansible`)

## 1. Configurar credenciales AWS

```bash
aws configure
# AWS Access Key ID:     (tu Access Key)
# AWS Secret Access Key: (tu Secret Key)
# Default region:        us-east-1
```

## 2. Desplegar con un solo comando

```bash
cd infrastructure
deploy.bat
```

El script hace todo automáticamente:

1. **Key pair** — Crea `terraform_ssh` en Lightsail y guarda el PEM en `%USERPROFILE%\.ssh\codensolar.pem`
2. **Terraform** — Crea instancia Lightsail, IP estática, firewall
3. **Ansible** — Lee variables del `.env`, clona el repo, instala Docker,
   corre migrations, collectstatic y deja systemd para auto-inicio

### Si Terraform falla con el bug conocido

El script lo detecta solo y recupera automáticamente:
```
Error: CreateInstance AWS Lightsail Instance (...): error waiting for request operation
```
Esto es un bug del provider — la instancia se crea pero Terraform no lo reporta.
El script importa los recursos al state y re-ejecuta.

## 3. Acceder

```bash
IP: (la que muestra el script al final)
SSH: ssh -i %USERPROFILE%\.ssh\codensolar.pem ubuntu@<IP>
```

## 4. Destruir todo

```bash
cd infrastructure\terraform
terraform destroy -auto-approve
```
