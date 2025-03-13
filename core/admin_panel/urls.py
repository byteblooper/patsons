from django.urls import path
from .views import CategoryView, SelectedSubCategoryView, ProductListCreate,ProductDetail,ComporsitionView

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='category-get-post'),
    path('categories/<str:pk>/', CategoryView.as_view(), name='category-detail-update-delete'),
    path('subcategories/<str:pk>/', SelectedSubCategoryView.as_view(), name='subcategories-inside-category'),
    path('products/', ProductListCreate.as_view(), name='product-get-post'),
    path('categorised-products/<uuid:pk>/', ProductListCreate.as_view(), name='get-post-products-inside-category'),# fetch product by category id
    path('products/<uuid:pk>/', ProductDetail.as_view(), name='update-delete-get_specific-product'),# get single product update delete
    path('compositions/', ComporsitionView.as_view(), name='Get-Post-compositions'),
    path('compositions/<uuid:pk>/', ComporsitionView.as_view(), name='update-delete-compositions'),
]
