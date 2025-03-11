from django.urls import path
from .views import CategoryView, SelectedSubCategoryView, ProductView

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='category'),
    path('categories/<str:pk>/', CategoryView.as_view(), name='category-detail'),
    path('subcategories/<str:pk>/', SelectedSubCategoryView.as_view(), name='subcategory-detail'),
    path('products/', ProductView.as_view(), name='product'),
    path('products/<str:pk>/', ProductView.as_view(), name='product-detail'),# fetch product by category id
]
