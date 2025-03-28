from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self,email,name,password=None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user=self.model(email=email,name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,name,password):
        user=self.create_user(email,name,password)
        user.is_admin=True
        user.is_superuser=True
        user.is_staff = True
        user.save(using=self._db)
        return user
    
    
class User(AbstractBaseUser, PermissionsMixin):
    email=models.EmailField(unique=True)
    name=models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    objects= UserManager()
    
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['name']
        



