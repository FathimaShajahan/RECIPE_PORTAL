from django.conf import settings
from django.urls import path
from . import views
from django.conf.urls.static import static
urlpatterns = [
    # Profile Management
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('profile/',views.profile_view,name='profile_view'),
    path('profile/<int:user_id>/', views.view_profile, name='view_profile'),
    
    # Recipe Management
    path('recipes/<int:recipe_id>/', views.view_detail, name='view_detail'),
    path('recipes/add/', views.add_recipe, name='add_recipe'),
    # path('recipes/edit/<int:recipe_id>/', views.edit_recipe, name='edit-recipe'),
    path('recipes/update/<int:recipe_id>/', views.update_recipe, name='update-recipe'),
    path('recipes/get/<int:recipe_id>/', views.get_recipe, name='get-recipe'),
    path('recipes/delete/<int:recipe_id>/', views.delete_recipe, name='delete_recipe'),
    path('recipes/', views.view_recipes, name='view_recipes'),
     path('recipes/user-recipes/', views.user_recipes, name='user_recipes'),
    path('recipes/search/', views.search_recipes, name='search_recipes'),
    path("recipes/<int:recipe_id>/increase-view/",views.increase_view_count, name="increase_view"),
    

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
