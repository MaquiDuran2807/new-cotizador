output "instance_ip" {
  description = "Static IP of the Lightsail instance"
  value       = aws_lightsail_static_ip.app.ip_address
}

output "instance_name" {
  description = "Name of the Lightsail instance"
  value       = aws_lightsail_instance.app.name
}

output "ssh_user" {
  description = "SSH user for the instance"
  value       = "ubuntu"
}


