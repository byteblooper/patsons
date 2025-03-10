from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminCategorySerializer, AdminProductSerializer

from api.models import Category, Product

# Create your views here.

class CategoryView(APIView):

    def get(self, request):
        categories = Category.objects.all()
        serializer = AdminCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = AdminCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        category = Category.objects.get(pk=pk)
        serializer = AdminCategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class ProductView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = AdminProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

