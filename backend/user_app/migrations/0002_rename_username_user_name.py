# Generated by Django 4.2 on 2025-02-28 07:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("user_app", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="user",
            old_name="username",
            new_name="name",
        ),
    ]
