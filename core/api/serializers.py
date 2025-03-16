from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import (
    Product, 
    ProductImage, 
    Composition, 
    Category,
    SubCategory,
    ContactUs, 
    Inquiry, 
    InquiryItems
)

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True)
    
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class CompositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Composition
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    sub_category = ProductSubCategorySerializer(read_only=True)
    composition = CompositionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'style_number', 'image', 'category', 'sub_category', 'composition']

class ProductDetailSerializer(serializers.ModelSerializer):
    composition = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    sub_category = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_composition(self, obj):
        return [{'id': c.id, 'material': c.material} for c in obj.composition.all()]
    
    def get_category(self, obj):
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'subcategories': [
                {'id': sub.id, 'name': sub.name} 
                for sub in obj.category.subcategories.all()
            ]
        }
    
    def get_sub_category(self, obj):
        return {
            'id': obj.sub_category.id,
            'name': obj.sub_category.name
        }
    
    def get_images(self, obj):
        return [{'id': img.id, 'image': img.image.url} for img in obj.images.all()]


    

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ['id', 'name', 'email', 'subject', 'message']






class InquiryItemsSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = InquiryItems
        fields = ['id', 'product']



class InquiryCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        help_text="List of product IDs for the inquiry"
    )

    class Meta:
        model = Inquiry
        fields = ['name', 'email', 'subject', 'message', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        inquiry = Inquiry.objects.create(**validated_data)

        for product_id in items_data:
            product = get_object_or_404(Product, id=product_id)
            inquiry_item = InquiryItems.objects.create(product=product)
            inquiry.items.add(inquiry_item)

        return inquiry
    

class InquirySerializer(serializers.ModelSerializer):
    items = InquiryItemsSerializer(many=True)

    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'email', 'subject', 'message', 'items', 'created_at', 'updated_at']