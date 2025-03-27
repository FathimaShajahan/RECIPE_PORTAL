from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_login, name='admin_login'),
    path('logout/', views.admin_logout, name='admin_logout'),
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('recipe/<int:recipe_id>/', views.view_recipe, name='view_recipe'),
    path('user/<int:user_id>/', views.user_profile, name='user_profile'),
    path('admin/user-management/', views.user_management, name='user_management'),
    path('admin/content-moderation/', views.content_moderation, name='content_moderation'),
    path('admin/most-viewed-recipes/', views.most_viewed_recipes, name='most_viewed_recipes'),
    path('block-user/<int:user_id>/', views.block_user, name='block_user'),
    path('unblock-user/<int:user_id>/', views.unblock_user, name='unblock_user'),
]
