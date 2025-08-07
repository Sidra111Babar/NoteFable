import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import NoteForm from './NotesForm';
import axios from 'axios';

export default function CreateNote({ token}) {
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const fetchNotes = () => {
    axios.get('http://localhost:8000/api/notes/', {
      headers: { Authorization: `Token ${token}` },
    }).then((res) => setNotes(res.data));
  };
  const addNote = (note) => {
    axios.post('http://localhost:8000/api/notes/', note, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => {
      fetchNotes();
      setShowForm(false); // Close form after saving
    });
  };

  if (showForm) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <NoteForm onSubmit={addNote} />
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );
}
