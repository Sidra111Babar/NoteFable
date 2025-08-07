

// Add this to Home.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NoteForm from './NotesForm';
import Archive from './Archive';
import Trash from './Trash';
import SearchFilterForm from './SearchFilterForm';
import {DocumentTextIcon,ArchiveBoxIcon,TrashIcon,XMarkIcon,ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import '../App.css';
/* Here touch screen is for mobile */
import { DndContext, closestCenter, PointerSensor,TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
/* Loading gif */
import Transparent from '../assets/Transparent.gif';
const gradients = [
  'linear-gradient(90deg, #232526 0%, #414345 100%)', // dark grey to charcoal
  'linear-gradient(90deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', // deep ocean blue
  'linear-gradient(90deg, #2b5876 0%, #4e4376 100%)', // dusky blue to purple
  'linear-gradient(90deg, #434343 0%, #000000 100%)', // smooth grey to black
  'linear-gradient(90deg, #141e30 0%, #243b55 100%)', // navy tones
  'linear-gradient(90deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)', // muted vibrant tones
  'linear-gradient(90deg, #1f1c2c 0%, #928dab 100%)', // twilight
  'linear-gradient(90deg, #485563 0%, #29323c 100%)', // steel grey to charcoal
  'linear-gradient(90deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', // space-like dark blue
  'linear-gradient(90deg, #2c3e50 0%, #4ca1af 100%)', // midnight teal
  'linear-gradient(90deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',     // deep blue to fiery orange
  'linear-gradient(90deg, #000000 0%, #434343 100%)',                  // pure black to charcoal fade
  'linear-gradient(90deg, #16222a 0%, #3a6073 100%)',                  // dark slate to stormy blue
 'linear-gradient(90deg, #200122 0%, #6f0000 100%)',                  // midnight purple to blood red
  'linear-gradient(90deg, #41295a 0%, #2F0743 100%)',                  // rich plum to dark violet
  'linear-gradient(90deg, #000428 0%, #004e92 100%)',                  // very dark navy to bright royal blue
  'linear-gradient(90deg, #134E5E 0%, #71B280 100%)',                  // forest green to muted mint
  'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',                  // steel blue to midnight navy
  'linear-gradient(90deg, #232526 0%, #3a3a3a 100%)',                  // dark grey base with soft contrast
  'linear-gradient(90deg, #3c1053 0%, #ad5389 100%)',   
  ];
  
function SortableNote({ note, deleteNote, archiveNote, trashNote }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: note.id,
  });
   /*  In case content is long */
  const [expanded, setExpanded] = useState(false);

  return (
    
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: gradients[
          Math.abs(
            note.id?.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          ) % gradients.length
        ],
      }}
      {...attributes}
      {...listeners}
      className="mb-4 p-4 border rounded text-white shadow cursor-move"
    >
      <h3 className="font-semibold">
        {note.title}
        <span className="text-sm text-white ml-2">
          ({new Date(note.created_at).toLocaleDateString()})
        </span>
      </h3>
      <p className={`text-sm mt-1 transition-all duration-200 ${expanded ? '' : 'line-clamp-3'}`}>{note.content}</p>
      {/* if content is too long */}
      {note.content.length > 100 && (
        <button
          className="text-xs text-white underline mt-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUpIcon className="h-5 w-5 inline" /> : <ChevronDownIcon className="h-5 w-5 inline" />}
        </button>
      )}
      <p className="text-sm italic">Tags: {note.tags}</p>
      <div className="flex gap-4 mt-2">
        <button
          className="text-white underline"
          onClick={() => deleteNote(note.id)}
        >
           <XMarkIcon className="h-5 w-5 inline" />
        </button>
        <button
          className="text-white underline"
          onClick={() => archiveNote(note.id)}
        >
          <ArchiveBoxIcon className="h-5 w-5 inline" />
        </button>
        <button
          className="text-white underline"
          onClick={() => trashNote(note.id)}
        >
          <TrashIcon className="h-5 w-5 inline" /> 
        </button>
      </div>
    </div>
  );
}


function Home() {
  const [notes, setNotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [view, setView] = useState('active');
  const [showForm, setShowForm] = useState(false);
  

  /* Search */
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const token = localStorage.getItem('token');
   /* loading */
  const [loading, setLoading] = useState(false);
  /* For image Upload*/
  const [note, setNote] = useState({ title: '', content: '', tags: '' });
  /* for recording audio */
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  /* Function for image handling */
  const fileInputRef = useRef();
   const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    axios.post('http://localhost:8000/api/extract_text/', formData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        const extractedText = res.data.text || '';
        setNote((prev) => ({
          ...prev,
          content: extractedText,
        }));
        setLoading(false);
        setShowForm(true);
      })
      .catch((err) => {
        alert('Failed to extract text from image');
        console.error(err);
      });
  };
  const fetchNotes = () => {
    axios.get('http://localhost:8000/api/notes/', {
      headers: { Authorization: `Token ${token}` },
    }).then((res) => setNotes(res.data));
  };

  const addNote = (note) => {
    axios.post('http://localhost:8000/api/notes/', note, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchNotes());
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:8000/api/notes/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchNotes());
  };

  const archiveNote = (id) => {
    axios.patch(`http://localhost:8000/api/notes/${id}/`, { is_archived: true }, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchNotes());
  };

  const trashNote = (id) => {
    axios.patch(`http://localhost:8000/api/notes/${id}/`, { is_trashed: true }, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchNotes());
  };

  /* drag and drop for cursor and touch screen */
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // avoids accidental drags from clicks
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,    // Wait 150ms before dragging starts
      tolerance: 5,  // Small finger movements won’t cancel it
    },
  })
);

  const handleDragEnd = (event) => {
    const { active, over } = event;
     console.log('Drag started', event);
    if (active.id !== over?.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over?.id);
      const reordered = arrayMove(notes, oldIndex, newIndex);
      setNotes(reordered);

      reordered.forEach((note, index) => {
        axios.patch(`http://localhost:8000/api/notes/${note.id}/`, {
          position: index,
        }, {
          headers: { Authorization: `Token ${token}` },
        });
      });
    }
  };

  const allTags = [...new Set(notes.flatMap(n => n.tags ? n.tags.split(',').map(t => t.trim()) : []))];

  const filteredNotes = selectedTag === 'all'
    ? notes
    : notes.filter(note => note.tags && note.tags.split(',').map(t => t.trim()).includes(selectedTag));

  const activeNotes = filteredNotes.filter(note => !note.is_archived && !note.is_trashed);
  const archivedNotes = filteredNotes.filter(note => note.is_archived);
  const trashedNotes = filteredNotes.filter(note => note.is_trashed);

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const filterAndSortNotes = (notes) => {
  let filtered = [...notes];

  // Tag Filter
  if (selectedTag !== 'all') {
    filtered = filtered.filter(note => note.tags?.includes(selectedTag));
  }

  // Search Filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    );
  }

  // Sorting
  if (sortOption === 'date-newest') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption === 'date-oldest') {
    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortOption === 'title-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'title-desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  return filtered;
};

/* This is for record handling */
const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      try {
        const response = await axios.post('http://localhost:8000/api/extract_voice_text/', formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setNote((prev) => ({ ...prev, content: response.data.text || '' }));
        setShowForm(true);
      } catch (error) {
        console.error('Error extracting voice text:', error);
        alert('Failed to extract text from voice.');
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };
  return (
    <div className="p-8 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
      My Notes
    </h2>

      <SearchFilterForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}/>
      {/* Fixed Action Buttons */}
        <div className="flex gap-3 mb-3 overflow-x-auto no-scrollbar">
            <button
              style={{clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)'}}
              onClick={() => setView('active')}
              className="flex items-center gap-2 px-4 py-1 rounded bg-blue-800 text-white whitespace-nowrap inset-shadow-sm inset-shadow-blue-500"
            >
              <DocumentTextIcon className="w-5 h-5" /> 
            </button>
            <button
              style={{clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)'}}
              onClick={() => setView('archived')}
              className="flex items-center gap-2 px-4 py-1 rounded bg-green-800 text-white whitespace-nowrap inset-shadow-sm inset-shadow-green-500"
            >
              <ArchiveBoxIcon className="w-5 h-5" />
            </button>
            <button
              style={{clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)'}}
              onClick={() => setView('trashed')}
              className="flex items-center gap-2 px-4 py-1 rounded bg-red-800 text-white whitespace-nowrap inset-shadow-sm inset-shadow-red-500"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
       </div>

      {/* Scrollable Tags */}
      <div className="flex overflow-x-auto gap-2 mb-4 no-scrollbar pb-2 bg-black text-white border border-blue-800">
        <button
          className={`px-3 py-1 mt-2 whitespace-nowrap ${selectedTag === 'all' ? 'bg-blue-800 text-white' : 'bg-black'}`}
          onClick={() => setSelectedTag('all')}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`px-3 mt-2 py-1 rounded whitespace-nowrap ${selectedTag === tag ? 'bg-blue-800 text-white' : 'bg-black'}`}
            onClick={() => setSelectedTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>
      {/* Mic btn */}
        {!showForm && (
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`fixed bottom-40 right-6 ${recording ? 'bg-red-600' : 'bg-green-800'} text-white rounded-full p-4 shadow-lg inset-shadow-sm inset-shadow-green-500 hover:opacity-90 transition duration-300`}
            type="button"
            title="Record Voice"
            style={{ zIndex: 9999 }}
          >
            🎙️
          </button>
        )}

       {/* Camera Upload Button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="fixed bottom-24 right-6 bg-purple-700 inset-shadow-sm inset-shadow-purple-500 rounded-full p-4 shadow-lg hover:bg-purple-800 transition duration-300"
        title="Upload Image"
        type="button"
        style={{ zIndex: 9999 }}
      >
        📷
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      {/* loading after image uploading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
          <img src={Transparent} alt="Loading..." className="w-[100px] h-[100px]" />
        </div>
      )}

      {/* When user click on this con then the form will show */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 bg-blue-800 inset-shadow-sm inset-shadow-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-900 transition duration-300"
          type="button"
          title="Add Note"
          style={{zIndex: 9999}}
        >
        ➕
        </button>
      )}

      {/*  When user cick on add note then form will disappear and note will be added */}
      {showForm && (
        <div className="mb-4">
          <NoteForm
            onSubmit={(note) => {
              addNote(note);
              setNote({ title: '', content: '', tags: '' });
              setShowForm(false);  // hide form after submission
            }}
            extractedText={note.content}
          />
          <button
            onClick={() => setShowForm(false)}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            type="button"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Notes Display */}
      {view === 'active' && (
  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
    <SortableContext items={filterAndSortNotes(activeNotes).map(note => note.id)} strategy={verticalListSortingStrategy}>
      {filterAndSortNotes(activeNotes).map((note) => (
        <SortableNote
          key={note.id}
          note={note}
          deleteNote={deleteNote}
          archiveNote={archiveNote}
          trashNote={trashNote}
        />
      ))}
    </SortableContext>
  </DndContext>
)}


      {view === 'archived' && <Archive notes={archivedNotes} />}
      {view === 'trashed' && <Trash notes={trashedNotes} />}
    </div>
  );
}

export default Home;