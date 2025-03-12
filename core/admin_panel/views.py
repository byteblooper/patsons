from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminCategorySerializer, AdminProductSerializer, AdminSubCategorySerializer

from api.models import Category, Product, SubCategory

# Create your views here.

from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import json

class SelectedSubCategoryView(APIView):
    def get(self, request, pk):
        try:
            # Get subcategories that belong to the specified category
            category = Category.objects.get(pk=pk)
            subcategories = category.subcategories.all()
            serializer = AdminSubCategorySerializer(subcategories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response(
                {'error': 'Category not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    


class CategoryView(APIView):
    """
    API view to manage categories.

    Methods:
    - GET: Retrieve a list of categories.
    - POST: Create a new category.
    - PUT: Update an existing category by ID.
    - DELETE: Delete a category by ID.
    """

    # permission_classes = [permissions.IsAuthenticated]

    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        """
        Retrieve a list of all categories.

        Returns:
            Response: A list of categories with HTTP status 200.
        """
        try:
            categories = Category.objects.all()
            serializer = AdminCategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """
        Create a new category.

        Args:
            request (Request): The request object containing category data.

        Returns:
            Response: The created category data with HTTP status 201 or error details with HTTP status 400.
        """
        serializer = AdminCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        """
        Update an existing category by ID.
        """
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create a mutable copy of the data without copying the file
        data = {}
        data['name'] = request.data.get('name')
        
        # Handle image separately
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']
        
        # Handle subcategories
        if 'subcategories' in request.data:
            try:
                subcategories = request.data['subcategories']
                if isinstance(subcategories, str):
                    data['subcategories'] = json.loads(subcategories)
                else:
                    data['subcategories'] = subcategories
            except json.JSONDecodeError:
                return Response(
                    {'error': 'Invalid subcategories data'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = AdminCategorySerializer(category, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a category by ID.

        Args:
            pk (str): The ID of the category to delete.

        Returns:
            Response: HTTP status 204 on successful deletion or error details with HTTP status 404.
        """
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProductView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, pk=None):
        if pk:
            products = Product.objects.filter(category_id=pk)
        else:
            products = Product.objects.all()

            
        serializer = AdminProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            # Handle composition data if it's a string
            if 'composition' in request.data and isinstance(request.data['composition'], str):
                request.data._mutable = True
                request.data['composition'] = json.loads(request.data['composition'])
                request.data._mutable = False

            serializer = AdminProductSerializer(
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminProductSerializer(
            product,
            data=request.data,
            context={'request': request},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




