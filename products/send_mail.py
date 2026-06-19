import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from django.conf import settings

def send_mail(recipient,title,body,file_urls):
  sender = settings.EMAIL_HOST_USER
  password = settings.EMAIL_HOST_PASSWORD

  message = MIMEMultipart()
  message["From"] = sender
  message["To"] = recipient
  message["Subject"] = title

  message.attach(MIMEText(body, "plain"))

  attachment = MIMEApplication(file_urls.read(), _subtype="pdf")
  attachment.add_header('Content-Disposition', 'attachment', filename=file_urls.name)
  message.attach(attachment)

  server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
  server.starttls()
  server.login(sender, password)

  txt = message.as_string()
  server.sendmail(sender, recipient, txt)
  server.quit()

  print("mail sended")
  
