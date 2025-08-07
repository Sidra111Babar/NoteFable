from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Note
from .serializers import NoteSerializer
# All these are for image text extraction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import easyocr
from PIL import Image
import numpy as np
from rest_framework.parsers import MultiPartParser, FormParser

# This is for voice
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import speech_recognition as sr
from pydub import AudioSegment, silence
import tempfile
import os
# This creates a ViewSet for the Note model. You don’t have to manually write the code for listing, creating, updating, or deleting—ModelViewSet does it all.
class NoteViewSet(viewsets.ModelViewSet):
    # Tells Django REST Framework which serializer to use to convert Note instances to/from JSON.
    serializer_class = NoteSerializer
    # permissions.IsAuthenticated: Ensures only logged-in users can access this API.
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures that each user only sees their own notes.
        return Note.objects.filter(user=self.request.user).order_by('position')    # ye position frontend se a rhi ha jo user drag and drop kr rha ha

    def perform_create(self, serializer):
        # When a new note is submitted (POST request), this method saves the note and automatically assigns the logged-in user to it.
        serializer.save(user=self.request.user)

# This is for image text extraction
class ExtractTextView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get('image')

        if not image_file:
            return Response({'error': 'No image uploaded'}, status=400)

        try:
            # Open image and convert to NumPy array
            image = Image.open(image_file).convert('RGB')
            image_np = np.array(image)

            # OCR
            reader = easyocr.Reader(['en'], gpu=False)
            result = reader.readtext(image_np, detail=0)
            extracted_text = "\n".join(result)

            return Response({'text': extracted_text})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# This is for the voice 
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
class ExtractVoiceTextAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        audio_file = request.FILES.get('audio')

        if not audio_file:
            return Response({'error': 'No audio file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the uploaded WebM file temporarily
            with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as temp_webm:
                for chunk in audio_file.chunks():
                    temp_webm.write(chunk)
                temp_webm_path = temp_webm.name

            # Convert webm to wav
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
                sound = AudioSegment.from_file(temp_webm_path, format="webm")
                sound = sound.set_channels(1).set_frame_rate(16000)  # Better for recognition
                sound.export(temp_wav.name, format="wav")
                temp_wav_path = temp_wav.name

            recognizer = sr.Recognizer()
            with sr.AudioFile(temp_wav_path) as source:
                audio_data = recognizer.record(source)

            text = recognizer.recognize_google(audio_data)

            print("Transcribed Text:", text)

            os.remove(temp_webm_path)
            os.remove(temp_wav_path)

            return Response({'text': text})

        except sr.UnknownValueError:
            return Response({'text': ''})  # No speech detected
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 