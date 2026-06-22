variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name (used for resource naming)"
  type        = string
  default     = "codensolar"
}

variable "blueprint_id" {
  description = "Lightsail blueprint (OS): ubuntu_24_04, ubuntu_22_04, amazon_linux_2023"
  type        = string
  default     = "ubuntu_24_04"
}

variable "bundle_id" {
  description = "Lightsail plan: nano_3_0 ($3.50), micro_3_0 ($7), small_3_0 ($12)"
  type        = string
  default     = "micro_3_0"
}

variable "ssh_key_name" {
  description = "Name of the Lightsail SSH key pair (must exist in Lightsail)"
  type        = string
  default     = "terraform_ssh"
}
