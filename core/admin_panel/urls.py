from django.urls import path
from .views import CategoryView, SelectedSubCategoryView, ProductListCreate,ProductDetail

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='category'),
    path('categories/<str:pk>/', CategoryView.as_view(), name='category-detail'),
    path('subcategories/<str:pk>/', SelectedSubCategoryView.as_view(), name='subcategory-detail'),
    path('products/', ProductListCreate.as_view(), name='product'),
    path('categorised-products/<uuid:pk>/', ProductListCreate.as_view(), name='product-detail'),# fetch product by category id
    path('products/<uuid:pk>/', ProductDetail.as_view(), name='product-detail'),# get single product update delete
]
