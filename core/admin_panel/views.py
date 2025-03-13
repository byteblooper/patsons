from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminCategorySerializer, AdminProductSerializer, AdminSubCategorySerializer,CompositionSerializer
from django.http import Http404
from api.models import Category, Product, Composition

# Create your views here.

from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import json

class SelectedSubCategoryView(APIView):
    '''
    login required. use access_token: Bearer <token>
    get: fetch all subcategories of a category
    '''
    permission_classes=[permissions.IsAuthenticated]
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
    

class ComporsitionView(APIView):
    '''
    login required. use access_token: Bearer <token>
    get: fetch all compositions
    
    post: create a new composition {"material":"name"}
    put:<uuid:pk> update a composition {"material":"name"}
    delete:<uuid:pk> delete a composition
    '''
    permission_classes=[permissions.IsAuthenticated]
    def get(self,request):
        try:
            compositions=Composition.objects.all()
            serializer= CompositionSerializer(compositions,many=True)
            return Response(
                {
                    'status': True,
                    'message': 'Compositions fetched successfully',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'message': 'Error fetching compositions',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def post(self,request):
        serializer=CompositionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'status': True,
                    'message': 'Composition created successfully',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request,pk):
        try:
            composition=Composition.objects.get(pk=pk)
            serializer=CompositionSerializer(composition,data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        'status': True,
                        'message': 'Composition updated successfully',
                        'data': serializer.data
                    },
                    status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Composition.DoesNotExist:
            return Response(
                {
                    'status': False,
                    'message': 'Composition not found',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'message': 'Error updating composition',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def delete(self,request,pk):
        try:
            composition=Composition.objects.get(pk=pk)
            composition.delete()
            return Response(
                {
                    'status': True,
                    'message': 'Composition deleted successfully',
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Composition.DoesNotExist:    
            return Response(
                {
                    'status': False,
                    'message': 'Composition not found',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'message': 'Error deleting composition',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
    permission_classes = [permissions.IsAuthenticated]


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
            return Response(
                {
                    'status': True,
                    'message': 'Category deleted successfully',
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProductListCreate(APIView):
    """   
    To get products of a category use category uuid.
    to post use this format:
    "style_number": "P12345",
    "gauge": "100",
    "end": "round",
    "weight": "200g",
    "description": "High-quality product",
    "composition": ["uuid-of-composition-1", "uuid-of-composition-2"],
    "category": "uuid-of-category",
    "sub_category": "uuid-of-subcategory",
    "image": "image.jpg",
    "images": [{ "image": "image1.jpg"},{ "image": "image2.jpg"} ]

    """
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request,pk=None):
        if pk:
            products = Product.objects.filter(category_id=pk)
        else:
            products = Product.objects.all()
        serializer = AdminProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AdminProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetail(APIView):
    """
    API view to handle the details of a single product.

    This view allows for retrieving, updating, and deleting a product
    based on its primary key (pk).

    Methods:
    - get_object(pk): Retrieves a product by its primary key.
    - get(request, pk): Returns the details of a product.
    - put(request, pk): Updates the details of a product.
    - delete(request, pk): Deletes a product.
    """
    
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):

        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk):

        product = self.get_object(pk)
        serializer = AdminProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):

        product = self.get_object(pk)
        serializer = AdminProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            {'message': 'Product updated successfully'},
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):

        product = self.get_object(pk)
        product.delete()
        return Response(
            {'message': 'Product deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )
