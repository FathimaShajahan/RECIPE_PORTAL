from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from recipe_app.models import Recipe
from django.contrib.auth import authenticate, login, logout

User = get_user_model()

from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages

from django.views.decorators.cache import never_cache

@never_cache
def admin_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(email=email, password=password)
        if user is not None and user.is_staff:
            login(request, user)
            return redirect('admin_dashboard')
        else:
            messages.error(request, "Invalid credentials or unauthorized access")
    return render(request, 'admin_login.html')

# Admin Logout
@never_cache
def admin_logout(request):
    logout(request) 
    return redirect('admin_login')


@never_cache
# Admin Dashboard
@login_required
def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect('admin_login')

    recipes = Recipe.objects.all().order_by('-created_at')  # Order by latest
    users = User.objects.all()
    most_viewed = Recipe.objects.order_by('-views')[:5]  # Order by view count

    return render(request, 'admin_dashboard.html', {
        'recipes': recipes,
        'users': users,
        'most_viewed': most_viewed
    })

# View Recipe Details
@login_required
@never_cache
def view_recipe(request, recipe_id):
    if not request.user.is_staff:
        return redirect('admin_login')

    recipe = get_object_or_404(Recipe, id=recipe_id)

    return render(request, 'view_recipe.html', {'recipe':recipe})

# User Profile with Recipes
@login_required
@never_cache
def user_profile(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')

    user = get_object_or_404(User, id=user_id)
    recipes = Recipe.objects.filter(user=user)

    return render(request, 'user_profile.html', {'user': user, 'recipes': recipes})

# Block User
@login_required
def block_user(request, user_id):
    if request.user.is_staff:
        user = User.objects.get(id=user_id)
        user.is_active = False
        user.save()
        messages.success(request, "User blocked successfully")
    return redirect('admin_dashboard')

# Unblock User
@login_required
def unblock_user(request, user_id):
    if request.user.is_staff:
        user = User.objects.get(id=user_id)
        user.is_active = True
        user.save()
        messages.success(request, "User unblocked successfully")
    return redirect('admin_dashboard')




@login_required
@never_cache
def user_management(request):
    if not request.user.is_staff:
        return redirect('admin_login')

    # Exclude superusers (admins) and staff members
    users = User.objects.filter(is_superuser=False, is_staff=False)

    return render(request, 'user_management.html', {'users': users})


@login_required
@never_cache
def content_moderation(request):
    recipes = Recipe.objects.all().order_by('-created_at')[:10]  # Recent 10 recipes
    return render(request, 'content_moderation.html', {'recipes': recipes})

@login_required
@never_cache
def most_viewed_recipes(request):
    most_viewed = Recipe.objects.all().order_by('-views')[:10]  # Top 10 most viewed
    return render(request, 'most_viewed_recipes.html', {'most_viewed': most_viewed})