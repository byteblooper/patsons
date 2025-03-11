from rest_framework import serializers
from api.models import Category, Product, SubCategory, ProductImage, Composition
from api.serializers import ProductImageSerializer, ProductSerializer, CategorySerializer, SubCategorySerializer, CompositionSerializer

class AdminSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name']  # Only include necessary fields

class AdminCategorySerializer(serializers.ModelSerializer):
    subcategories = AdminSubCategorySerializer(many=True, required=False)

    class Meta:
        model = Category
        fields = '__all__'

    def create(self, validated_data):
        subcategories_data = validated_data.pop('subcategories', [])
        category = Category.objects.create(**validated_data)
        
        for subcategory_data in subcategories_data:
            subcategory = SubCategory.objects.create(**subcategory_data)
            category.subcategories.add(subcategory)
        
        return category

    def update(self, instance, validated_data):
        subcategories_data = validated_data.pop('subcategories', [])
        instance.name = validated_data.get('name', instance.name)
        if 'image' in validated_data:
            instance.image = validated_data.get('image')
        instance.save()

        # Clear existing subcategories and add new ones
        instance.subcategories.clear()
        for subcategory_data in subcategories_data:
            subcategory = SubCategory.objects.create(**subcategory_data)
            instance.subcategories.add(subcategory)

        return instance

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']  # Only include necessary fields

class AdminProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False, read_only=True)  # Make it read-only
    composition = serializers.PrimaryKeyRelatedField(many=True, queryset=Composition.objects.all(), required=False)
    image = serializers.ImageField(required=False)  # Add this for main image
    
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        images = self.context['request'].FILES.getlist('images', [])
        composition_data = validated_data.pop('composition', [])
        
        # Create the product without M2M fields
        product = Product.objects.create(**validated_data)
        
        # Add composition if provided
        if composition_data:
            product.composition.set(composition_data)
        
        # Create product images
        for image in images:
            ProductImage.objects.create(image=image).product_images.add(product)
            
        return product

    def update(self, instance, validated_data):
        images = self.context['request'].FILES.getlist('images', [])
        composition_data = validated_data.pop('composition', None)
        
        # Update the product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update composition if provided
        if composition_data is not None:
            instance.composition.set(composition_data)

        # Handle images if provided
        if images:
            # Clear existing images
            instance.images.clear()
            # Add new images
            for image in images:
                ProductImage.objects.create(image=image).product_images.add(instance)

        return instance

class AdminProductDetailSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = '__all__'

    def get_images(self, obj):
        return obj.images.all().values_list('image', flat=True)



