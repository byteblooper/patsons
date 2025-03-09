from rest_framework import serializers
from api.models import Category, Product, SubCategory

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

class AdminProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class AdminProductDetailSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = '__all__'

    def get_images(self, obj):
        return obj.images.all().values_list('image', flat=True)


