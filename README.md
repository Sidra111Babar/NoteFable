# NoteGenius
Smart, searchable, and AI-powered Notes App with voice-to-text, image-to-text, tagging, drag &amp; drop, archive, and more.


A powerful and intuitive Notes App built for productivity. Easily create, organize, and manage your notes with advanced features like tagging, archiving, trash, drag & drop, voice-to-text, and image-to-text conversion.

---

## 🚀 Features

### ✍️ Create & Manage Notes
- Add rich text notes with title, content, and tags.
- Edit your notes anytime.
- Delete notes to move them to Trash.
- Archive notes you want to keep but hide from the main view.

### 📂 Organize Notes
- Tag your notes for better categorization.
- Search bar to instantly find any note by keyword.
- Sort notes by title, creation date, or tags.
- Drag and drop notes to rearrange or categorize.

### 🔊 Voice-to-Text
- Record your voice directly within the app.
- Automatically convert speech to text and populate the note content area.

### 🖼️ Image-to-Text (OCR)
- Upload an image containing text.
- Extracted text is automatically filled into the content area of the note form.

### 🗑️ Archive & Trash
- View Archived and Trashed notes separately.
- Restore notes from Archive/Trash or permanently delete them.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Django + Django REST Framework
- **Authentication:** Token-based login/register
- **Voice Recognition:** Web Speech API / SpeechRecognition (Python)
- **Image to Text:** EasyOCR 
- **Styling:** Tailwind CSS / Custom CSS
- **Database:** SQLite

---

## 📸 Screenshots



<p float="left">
  <img src="<img width="938" height="437" alt="image" src="https://github.com/user-attachments/assets/4056ad41-39d1-453f-bb3a-5be9c3b65858" />
" width="300" alt="Home Page" />
  <img src="screenshots/voice-input.png" width="300" alt="Voice Input" />
  <img src="screenshots/image-to-text.png" width="300" alt="Image to Text" />
  <img src="screenshots/tagging.png" width="300" alt="Tagging" />
</p>

---

## 📦 Setup Instructions

### 🔧 Frontend

```bash
cd frontend
npm install
npm run dev
