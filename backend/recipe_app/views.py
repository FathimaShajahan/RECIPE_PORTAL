from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# from django.views.decorators.cache import never_cache
from .models import Recipe
import json
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator

User = get_user_model()  # Get custom User model

# Profile Management
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def edit_profile(request):
    data = json.loads(request.body)
    request.user.name = data.get('name', request.user.name)
    request.user.email = data.get('email', request.user.email)
    request.user.save()
    return JsonResponse({'message': 'Profile updated successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    recipes = Recipe.objects.filter(user=user)
    return JsonResponse({
        'name': user.name,
        'email': user.email,
        'recipes': list(recipes.values('id', 'title', 'image'))
    })
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response({"name": request.user.name}, status=status.HTTP_200_OK)


# Recipe Management
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt

def add_recipe(request):
    """Handles recipe creation including image upload"""
    
    if request.content_type == 'application/json':
        data = json.loads(request.body)
        title = data.get('title')
        ingredients = data.get('ingredients')
        steps = data.get('steps')
        cooking_time = data.get('cooking_time')
        difficulty = data.get('difficulty')
        image = None  # No file uploads via JSON

    else:  # Handling form-data (file upload case)
        title = request.POST.get('title')
        ingredients = request.POST.get('ingredients')
        steps = request.POST.get('steps')
        cooking_time = request.POST.get('cooking_time')
        difficulty = request.POST.get('difficulty')
        image = request.FILES.get('image')

    if not title:
        return JsonResponse({'error': 'Title is required'}, status=400)

    recipe = Recipe.objects.create(
        user=request.user,
        title=title,
        ingredients=ingredients,
        steps=steps,
        cooking_time=cooking_time,
        difficulty=difficulty,
        image=image  # Save the uploaded image if available
    )

    return JsonResponse({
        'message': 'Recipe added successfully',
        'recipe_id': recipe.id,
        'image_url': recipe.image.url if recipe.image else None
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def view_detail(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)


    data = {
        "id": recipe.id,
        "title": recipe.title,
        "image": request.build_absolute_uri(recipe.image.url) if recipe.image else None,
        "ingredients": recipe.ingredients.split("\n"),
        "steps": recipe.steps.split("\n"),
        "cooking_time": recipe.cooking_time,
        "views":recipe.views,
        "difficulty": recipe.difficulty,
          "user": {
            "id": recipe.user.id,
            "name": recipe.user.name,
            "email": recipe.user.email  # Optional, include only if necessary
        } if recipe.user else None
    }

    return JsonResponse(data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recipe(request, recipe_id):
    """Handles GET requests to retrieve a recipe"""
    recipe = get_object_or_404(Recipe, id=recipe_id)

    return JsonResponse({
        "id": recipe.id,
        "title": recipe.title,
        "image": recipe.image.url if recipe.image else None,
        "ingredients": recipe.ingredients.split("\n"),
        "steps": recipe.steps.split("\n"),
        "cooking_time": recipe.cooking_time,
        "difficulty": recipe.difficulty,
    })  


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_recipe(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)

    title = request.data.get("title", recipe.title)
    ingredients = request.data.get("ingredients", recipe.ingredients)
    steps = request.data.get("steps", recipe.steps)
    cooking_time = request.data.get("cooking_time", recipe.cooking_time)
    difficulty = request.data.get("difficulty", recipe.difficulty)
    image = request.FILES.get("image", recipe.image)

    recipe.title = title
    recipe.ingredients = ingredients
    recipe.steps = steps
    recipe.cooking_time = cooking_time
    recipe.difficulty = difficulty
    recipe.image = image
    recipe.save()

    return JsonResponse({"message": "Recipe updated successfully!", "recipe_id": recipe.id})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_recipe(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id, user=request.user)
    if recipe.image:
        default_storage.delete(recipe.image.path)  # Delete image from storage
    recipe.delete()
    return JsonResponse({'message': 'Recipe deleted successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_recipes(request):
    # recipes = Recipe.objects.all()
    recipes = Recipe.objects.select_related('user').all() 
    recipe_data = [
        {
            'id': r.id,
            'title': r.title,
            'views':r.views,
            'image_url': request.build_absolute_uri(r.image.url) if r.image else None,
             'user': {
                'id': r.user.id,
                'name': r.user.name,
                'email': r.user.email,  # Include email if needed
            }
            
        }
        for r in recipes
    ]
    return JsonResponse({'recipes': recipe_data})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_recipes(request):
    user = request.user  # Get the logged-in user
    recipes = Recipe.objects.filter(user=user)  # Fetch only this user's recipes

    recipe_data = [
        {
            'id': r.id,
            'title': r.title,
            'views':r.views,
            'image_url': request.build_absolute_uri(r.image.url) if r.image else None,
            'description': r.steps[:50] + '...' if r.steps else '',  # Short description
            'user': {'id': r.user.id, 'username': r.user.name},
        }
        for r in recipes
    ]

    return JsonResponse({'recipes': recipe_data})


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def increase_view_count(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        recipe.views += 1
        recipe.save()
        return Response({"message": "View count updated", "updated_views": recipe.views}, status=200)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_recipes(request):
    query = request.GET.get('q', '').strip().lower()
    limit = int(request.GET.get('limit', 3))  # Default to 3 recipes per page
    offset = int(request.GET.get('offset', 0))

    filtered_recipes = Recipe.objects.filter(title__icontains=query).values('id', 'title', 'image')

    paginator = Paginator(filtered_recipes, limit)
    page_number = (offset // limit) + 1
    page = paginator.get_page(page_number)

    return JsonResponse({
        'recipes': list(page.object_list),
        'count': paginator.count  # Total number of recipes found
    })

# Admin Functionality
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_admin:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    recipes = Recipe.objects.all().values('id', 'title', 'image')
    users = User.objects.all().values('id', 'name', 'email')

    return JsonResponse({'recipes': list(recipes), 'users': list(users)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_user(request, user_id):
    if not request.user.is_admin:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    user = get_object_or_404(User, id=user_id)
    user.is_active = False
    user.save()
    return JsonResponse({'message': 'User blocked successfully'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unblock_user(request, user_id):
    if not request.user.is_admin:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    user = get_object_or_404(User, id=user_id)
    user.is_active = True
    user.save()
    return JsonResponse({'message': 'User unblocked successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def most_viewed_recipes(request):
    """Fetches the top 10 most viewed recipes with image URLs"""
    recipes = Recipe.objects.order_by('-views')[:10].values('id', 'title', 'views', 'image')
    return JsonResponse({
        'recipes': [{'id': r['id'], 'title': r['title'], 'views': r['views'], 'image_url': r['image']} for r in recipes]
    })
