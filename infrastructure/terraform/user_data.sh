#!/bin/bash
set -e

# Solo instala Docker (rápido, < 30 seg)
apt-get update -y
apt-get install -y docker.io docker-compose-v2 git
systemctl enable docker
systemctl start docker
