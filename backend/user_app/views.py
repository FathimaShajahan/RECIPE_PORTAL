from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Fetch user by email
        user = User.objects.filter(email=email).first()
        
        # Check if user exists and password is correct
        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


         # Update last login time
        user.last_login = now()
        user.save(update_fields=['last_login'])

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
            'last_login': user.last_login 
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logger.info(f"Logout request received from: {request.user}") 
    try:
        refresh_token = request.data.get('refresh')  # Use `.get()` to avoid KeyError
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the token
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Logout error: {e}")
        return Response({'error': 'Invalid token', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)






@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not check_password(current_password, user.password):
        return Response({"success": False, "message": "Current password is incorrect!"}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({"success": True, "message": "Password updated successfully!"})
