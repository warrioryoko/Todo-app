from django.db import models
from django.utils import timezone

# Create your models here.
	
class ToDo(models.Model):
	title = models.CharField(max_length=255)
	description = models.TextField()
