from django.db import models

# Create your models here.
from django.db import models
# Imports the built-in User model that represents registered users (used for login/auth).
from django.contrib.auth.models import User

class Note(models.Model):
    # ForeignKey means each note belongs to one user (but one user can have many notes).
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    position = models.PositiveIntegerField(default=0)   # Notes ko drag and drop krny ka bad position ko stable rakhny ka lya backend me position b store ki
    tags = models.CharField(max_length=200, blank=True)
    # Archive and Trash ko maintian rakhny ka lya
    is_archived = models.BooleanField(default=False)
    is_trashed = models.BooleanField(default=False)
    class Meta:
        ordering = ['position'] 
    def __str__(self):
        return self.title