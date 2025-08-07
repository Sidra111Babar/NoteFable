import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Trashed() {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8000/api/notes/', {
      headers: { Authorization: `Token ${token}` },
    }).then((res) => {
      const trashed = res.data.filter(n => n.is_trashed);
      setNotes(trashed);
    });
  }, []);

  const restoreNote = (id) => {
    axios.patch(`http://localhost:8000/api/notes/${id}/`, {
      is_trashed: false,
    }, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => setNotes(prev => prev.filter(n => n.id !== id)));
  };

  const permanentlyDelete = (id) => {
    axios.delete(`http://localhost:8000/api/notes/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    }).then(() => setNotes(prev => prev.filter(n => n.id !== id)));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Trashed Notes</h2>
      {notes.map(note => (
        <div key={note.id} className="mb-4 p-4 border rounded shadow bg-red-100">
          <h3 className="font-semibold">{note.title}</h3>
          <p>{note.content}</p>
          <button className="mt-2 text-blue-500 mr-2" onClick={() => restoreNote(note.id)}>
            Restore
          </button>
          <button className="mt-2 text-red-700" onClick={() => permanentlyDelete(note.id)}>
            Delete Permanently
          </button>
        </div>
      ))}
    </div>
  );
}

export default Trashed;
