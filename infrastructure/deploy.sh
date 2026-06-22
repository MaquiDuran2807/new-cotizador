#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "============================================"
echo " Codensolar - Despliegue en AWS Lightsail"
echo "============================================"
echo ""

# Verificar herramientas
for cmd in aws terraform ansible-playbook; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "[ERROR] $cmd no encontrado. Instalalo primero."
        exit 1
    fi
done

# Verificar key pair en Lightsail
echo "[INFO] Verificando key pair 'terraform_ssh' en Lightsail..."
if ! aws lightsail get-key-pair --key-pair-name terraform_ssh &>/dev/null; then
    echo "[INFO] Key pair no existe. Creandolo..."
    aws lightsail create-key-pair --key-pair-name terraform_ssh --query 'privateKeyBase64' --output text > ~/.ssh/codensolar.pem
    chmod 600 ~/.ssh/codensolar.pem
    echo "[OK] PEM guardado en ~/.ssh/codensolar.pem"
else
    echo "[OK] Key pair 'terraform_ssh' ya existe."
    if [ ! -f ~/.ssh/codensolar.pem ]; then
        echo "[WARN] ~/.ssh/codensolar.pem no existe. Recreando key pair..."
        aws lightsail delete-key-pair --key-pair-name terraform_ssh
        aws lightsail create-key-pair --key-pair-name terraform_ssh --query 'privateKeyBase64' --output text > ~/.ssh/codensolar.pem
        chmod 600 ~/.ssh/codensolar.pem
        echo "[OK] PEM guardado en ~/.ssh/codensolar.pem"
    fi
fi

# Terraform
cd "$DIR/terraform"
echo ""
echo "[INFO] Ejecutando terraform init..."
terraform init

echo "[INFO] Ejecutando terraform apply..."
terraform apply -auto-approve
TF_EXIT=$?

# Recovery del bug de Lightsail
if [ $TF_EXIT -ne 0 ]; then
    echo ""
    echo "[WARN] Terraform reporto error. Verificando si la instancia se creo..."
    INSTANCE_EXISTS=$(aws lightsail get-instances --query "instances[?name=='codensolar'].[name]" --output text 2>/dev/null)
    
    if [ -n "$INSTANCE_EXISTS" ]; then
        echo "[OK] La instancia existe. Importando al state..."
        terraform import aws_lightsail_static_ip.app codensolar-ip 2>/dev/null || true
        terraform import aws_lightsail_instance.app codensolar
        echo "[INFO] Re-ejecutando terraform apply..."
        terraform apply -auto-approve
        TF_EXIT=$?
    else
        echo "[ERROR] La instancia no se creo."
        exit 1
    fi
fi

if [ $TF_EXIT -ne 0 ]; then
    echo "[ERROR] Terraform fallo definitivamente."
    exit 1
fi

# Obtener IP
INSTANCE_IP=$(terraform output -raw instance_ip)
echo ""
echo "IP de la instancia: $INSTANCE_IP"

# Generar variables de Ansible desde .env
echo ""
echo "[INFO] Generando variables desde .env..."
python3 "$DIR/ansible/generate_vars.py"

# Actualizar inventory.yml con la IP real
sed -i "s/ansible_host:.*/ansible_host: $INSTANCE_IP/" "$DIR/ansible/inventory.yml"
echo "[OK] inventory.yml actualizado con IP $INSTANCE_IP"

# Ejecutar Ansible
echo ""
echo "============================================"
echo " Ejecutando Ansible..."
echo "============================================"
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.yml playbook.yml

echo ""
echo "============================================"
echo " Despliegue completado!"
echo "============================================"
echo "IP: $INSTANCE_IP"
echo "SSH: ssh -i ~/.ssh/codensolar.pem ubuntu@$INSTANCE_IP"
