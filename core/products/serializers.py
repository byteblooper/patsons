from rest_framework import serializers
from api.models import Product, ProductImage, Category, SubCategory, Composition

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']



class ProductSerializer(serializers.ModelSerializer):
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
