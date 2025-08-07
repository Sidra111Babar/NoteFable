// src/components/NotesForm.js
import React, { useState, useEffect } from 'react';

function NoteForm({ onSubmit,extractedText = '' }) {
  const [note, setNote] = useState({ title: '', content: '', tags: '' });
  useEffect(() => {
    if (extractedText) {
      setNote((prev) => ({ ...prev, content: extractedText }));
    }
  }, [extractedText]);
  const handleChange = (e) =>
    setNote({ ...note, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(note);
    setNote({ title: '', content: '', tags: '' });
  };

  return (
    <div className="relative">
       <div
          className="absolute top-0 left-0 w-0 h-0"
          style={{
            borderTop: '40px solid #410bc8ff',     // Purple color
            borderRight: '40px solid transparent'
          }}
        />
      <form onSubmit={handleSubmit} className="mb-4 p-8 rounded-2xl shadow-md space-y-4 bg-black text-white border border-blue-800 shadow-blue-800">
        <input
          name="title"
          value={note.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
        />
        <textarea
          name="content"
          value={note.content}
          onChange={handleChange}
          placeholder="Content"
          rows="4"
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 transition resize-none"
        />
        <input
          name="tags"
          value={note.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated, e.g. work,personal)"
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
        />
        <button type="submit" className="w-full bg-blue-800 hover:bg-blue-700 text-white text-white py-2 px-4 rounded-xl transition font-semibold">
          Add Note
        </button>
      </form>
    </div>
  );
}

export default NoteForm;
