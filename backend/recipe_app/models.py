from re import U
from django.db import models
# Create your models here.
from django.utils.timezone import now
from user_app.models import User
from django.conf import settings 

class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null=False, blank=False)
    ingredients = models.TextField()
    steps = models.TextField()
    cooking_time = models.IntegerField(help_text="Cooking time in minutes")
    difficulty = models.CharField(max_length=10, choices=[('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')])
    image = models.ImageField(upload_to="recipes/", blank=True, null=True)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=now)
    
    def __str__(self):
        return self.title