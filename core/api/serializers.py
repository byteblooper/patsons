from rest_framework import serializers
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

class ProductSerializer(serializers.ModelSerializer):
    composition = CompositionSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class ProductDetailSerializer(serializers.ModelSerializer):
    composition = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
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
    
    def get_images(self, obj):
        return [{'id': img.id, 'image': img.image.url} for img in obj.images.all()]

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ['id', 'name', 'email', 'subject', 'message']

class InquiryItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InquiryItems
        fields = ['id', 'product']

class InquirySerializer(serializers.ModelSerializer):
    items = InquiryItemsSerializer(many=True, required=False)
    
    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'email', 'subject', 'message', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        inquiry = Inquiry.objects.create(**validated_data)
        
        # Create and add items
        if items_data:
            for item_data in items_data:
                item = InquiryItems.objects.create(**item_data)
                inquiry.items.add(item)
        
        return inquiry

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['items'] = InquiryItemsSerializer(instance.items.all(), many=True).data
        return representation




