from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet,ExtractTextView,ExtractVoiceTextAPIView


router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('extract_text/', ExtractTextView.as_view(), name='extract_text'),
    path('extract_voice_text/', ExtractVoiceTextAPIView.as_view(), name='extract-voice-text'),

]