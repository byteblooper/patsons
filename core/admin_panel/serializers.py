from rest_framework import serializers
from api.models import Category, Product

class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

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


