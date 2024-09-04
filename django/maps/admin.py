from django.contrib import admin
from .models import BoundingBox


@admin.register(BoundingBox)
class BoundingBoxAdmin(admin.ModelAdmin):
    # Opções de exibição na lista do admin
    list_display = ('lat', 'long')
    search_fields = ('lat', 'long')
