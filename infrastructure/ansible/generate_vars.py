#!/usr/bin/env python3
"""Genera group_vars/deploy.yml a partir del .env del proyecto."""
import re
import sys
from pathlib import Path

ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"
OUTPUT = Path(__file__).resolve().parent / "group_vars" / "deploy.yml"

if not ENV_FILE.exists():
    print(f"[ERROR] No se encuentra .env en {ENV_FILE}")
    sys.exit(1)

vars = {}
for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
    m = re.match(r'^\s*([A-Za-z_]\w*)\s*=\s*(.+)\s*$', line)
    if m:
        key = m.group(1).lower()
        val = m.group(2).strip().strip("'\"")
        vars[key] = val

yaml = f"""\
# Generado automaticamente desde .env
secret_key: {vars.get('secret_key', '')}
db_password: {vars.get('db_password', '')}
email_user: {vars.get('email_host_user', '')}
email_password: {vars.get('email_host_password', '')}
email_host: {vars.get('email_host', 'smtp.gmail.com')}
email_port: {vars.get('email_port', '587')}
google_client_id: {vars.get('google_client_id', '')}
google_secret: {vars.get('google_secret', '')}
domain_name: codensolar.com
"""

OUTPUT.write_text(yaml, encoding="utf-8")
print(f"[OK] Variables generadas en {OUTPUT}")
