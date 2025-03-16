from rest_framework import serializers
from api.models import Category, Product, SubCategory, ProductImage, Composition
from api.serializers import ProductImageSerializer, ProductSerializer, CategorySerializer, SubCategorySerializer, CompositionSerializer

class AdminSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name']  # Only include necessary fields

class CompositionSeriallizer(serializers.ModelSerializer):
    class Meta:
        model = Composition
        fields ='__all__'


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
    image = serializers.ImageField(required=False)
    images = ProductImageSerializer(many=True, required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    sub_category = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), required=False)
    composition = serializers.PrimaryKeyRelatedField(queryset=Composition.objects.all(), many=True)

    class Meta:
        model = Product
        fields = [
            'id', 'style_number', 'gauge', 'end', 'weight', 'description', 
            'composition', 'category', 'sub_category', 'image', 'images'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        composition_data = validated_data.pop('composition', [])
        
        # Create the product instance
        product = Product.objects.create(**validated_data)

        # Add composition objects to the ManyToMany field
        product.composition.set(composition_data)

        # Handle images
        for image_data in images_data:
            product_image = ProductImage.objects.create(**image_data)
            product.images.add(product_image)

        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        composition_data = validated_data.pop('composition', [])

        # Update basic fields
        instance.style_number = validated_data.get('style_number', instance.style_number)
        instance.gauge = validated_data.get('gauge', instance.gauge)
        instance.end = validated_data.get('end', instance.end)
        instance.weight = validated_data.get('weight', instance.weight)
        instance.description = validated_data.get('description', instance.description)

        # Set many-to-many relationship for composition
        instance.composition.set(composition_data)

        # Update foreign keys
        instance.category = validated_data.get('category', instance.category)
        instance.sub_category = validated_data.get('sub_category', instance.sub_category)

        # Handle single image
        if 'image' in validated_data:
            instance.image = validated_data['image']

        # Handle Many-to-many field for images
        if images_data:
            instance.images.clear()
            for image_data in images_data:
                product_image = ProductImage.objects.create(**image_data)
                instance.images.add(product_image)

        instance.save()
        return instance
