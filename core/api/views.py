from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.db.models import Prefetch
from .models import Product, ProductImage, Composition, Category, SubCategory, ContactUs, Inquiry, InquiryItems
from .serializers import (
    ProductSerializer, 
    ProductDetailSerializer, 
    CategorySerializer,
    ContactUsSerializer, 
    InquirySerializer
)

from .services.email_service import EmailService
from django.db import connection
from django.db import reset_queries
import time
from django.core.cache import cache

class CategoryList(APIView):
    """
    Get all categories with their subcategories
    """
    @method_decorator(cache_page(60 * 15))
    @method_decorator(vary_on_cookie)
    def get(self, request):
        try:
            categories = Category.objects.prefetch_related('subcategories').all()
            serializer = CategorySerializer(categories, many=True)
            return Response({
                'status': 'success',
                'message': 'Categories fetched successfully',
                'categories': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductList(APIView):
    def get(self, request):
        try:
            cache_key = 'product_list'
            products = cache.get(cache_key)
            
            if products is None:
                products = Product.objects.select_related('category').prefetch_related(
                    Prefetch('composition', queryset=Composition.objects.only('id', 'material')),
                    Prefetch('images', queryset=ProductImage.objects.only('id', 'image')),
                    Prefetch('sub_category', queryset=SubCategory.objects.only('id', 'name'))
                ).all()
                cache.set(cache_key, products, timeout=300)  # Cache for 5 minutes
            
            # Reset query log
            reset_queries()
            
            # Start time
            start = time.time()
            
            # Convert to list to execute the query
            products_list = list(products)
            
            # Print query count and time
            query_count = len(connection.queries)
            end = time.time()
            
            print(f"Number of queries: {query_count}")
            print(f"Time taken: {end - start:.2f} seconds")
            
            # Print actual queries for analysis
            for query in connection.queries:
                print(f"Query: {query['sql']}")
            
            serializer = ProductSerializer(
                products_list, 
                many=True, 
                context={'request': request}
            )
            
            return Response({
                'status': 'success',
                'message': 'Products fetched successfully',
                'products': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductDetail(APIView):
    """
    Get product details by ID
    """
    @method_decorator(cache_page(60 * 15))
    @method_decorator(vary_on_cookie)
    def get(self, request, pk):
        try:
            product = get_object_or_404(
                Product.objects.select_related('category').prefetch_related(
                    Prefetch('images', queryset=ProductImage.objects.all()),
                    Prefetch('composition', queryset=Composition.objects.all())
                ),
                id=pk
            )
            
            serializer = ProductDetailSerializer(product)
            return Response({
                'status': 'success',
                'message': 'Product details fetched successfully',
                'product': serializer.data
            }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Product not found with id: {pk}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



class ContactUsView(APIView):
    """
    API view to handle contact form submissions
    """
    def post(self, request):
        serializer = ContactUsSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            
            # Send email using the service
            email_sent = EmailService.send_contact_email(contact)
            
            response_data = {
                'status': 'success',
                'message': 'Contact form submitted successfully',
                'data': serializer.data
            }
            
            if not email_sent:
                response_data['warning'] = 'Form submitted but notification email failed'
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        return Response(
            {
                'status': 'error', 
                'message': 'Invalid data provided',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class InquiryView(APIView):
    """
    Handle product inquiries
    """
    def post(self, request):
        try:
            serializer = InquirySerializer(data=request.data)
            if serializer.is_valid():
                inquiry = serializer.save()
                
                # Process inquiry items
                items_data = request.data.get('items', [])
                for item_data in items_data:
                    product = get_object_or_404(Product, id=item_data['product'])
                    inquiry_item = InquiryItems.objects.create(
                        product=product
                    )
                    inquiry.items.add(inquiry_item)
                
                return Response({
                    'status': 'success',
                    'message': 'Inquiry submitted successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'status': 'error',
                'message': 'Invalid data provided',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

