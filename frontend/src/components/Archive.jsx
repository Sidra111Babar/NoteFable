import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Archived() {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8000/api/notes/', {
      headers: { Authorization: `Token ${token}` },
    }).then((res) => {
      const archived = res.data.filter(n => n.is_archived && !n.is_trashed);
      setNotes(archived);
    });
  }, []);

  const unarchiveNote = (id) => {
    axios.patch(`http://localhost:8000/api/notes/${id}/`, {
      is_archived: false,
    }, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => setNotes(prev => prev.filter(n => n.id !== id)));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Archived Notes</h2>
      {notes.map(note => (
        <div key={note.id} className="mb-4 p-4 border rounded shadow bg-gray-100">
          <h3 className="font-semibold">{note.title}</h3>
          <p>{note.content}</p>
          <button
            className="mt-2 text-green-500"
            onClick={() => unarchiveNote(note.id)}
          >
            Unarchive
          </button>
        </div>
      ))}
    </div>
  );
}

export default Archived;
