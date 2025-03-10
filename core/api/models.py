from django.db import models
from uuid import uuid4
# Create your models here.
class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return str(self.image.name) if self.image else 'No Image'


class Composition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    material = models.CharField(max_length=100)

    def __str__(self):
        return self.material

class SubCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name
    

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    name = models.CharField(max_length=50)
    subcategories = models.ManyToManyField(SubCategory, related_name='categories')
    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    style_number = models.CharField(max_length=50, db_index=True)
    gauge = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    weight = models.CharField(max_length=50)
    description = models.TextField()
    composition = models.ManyToManyField(
        Composition, 
        related_name='product_materials',
        db_index=True
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        db_index=True
    )
    image = models.ImageField(upload_to='product_images/')
    images = models.ManyToManyField(
        ProductImage, 
        related_name='product_images',
        db_index=True
    )

    def __str__(self):
        return self.style_number

    class Meta:
        indexes = [
            models.Index(fields=['style_number', 'category']),
        ]







class BaseContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ContactUs(BaseContact):

    
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.email} - {self.subject}"
    class Meta:
        verbose_name = 'Contact Us'
        verbose_name_plural = 'Contact Us'

class InquiryItems(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product.name}"
    
    class Meta:
        verbose_name = 'Inquiry Item'
        verbose_name_plural = 'Inquiry Items'
    
class Inquiry(BaseContact):

    items = models.ManyToManyField(InquiryItems, blank=True)
    is_read = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.name} - {self.email} - {self.subject}"
    
    class Meta:
        verbose_name = 'Inquiry'
        verbose_name_plural = 'Inquiries'



