import React from 'react';

function NoteCard({ note, onDelete, onPin, onArchive, onTrash }) {
  return (
    <div className="p-4 border rounded mb-4 relative" style={{ backgroundColor: '#fffbe6' }}>
      {note.is_pinned && (
        <div className="absolute top-2 right-2 text-yellow-500">📌</div>
      )}
      <h3 className="font-semibold">{note.title}</h3>
      <p>{note.content}</p>
      {note.reminder_time && (
        <p className="text-sm text-gray-500 mt-1">⏰ Reminder: {new Date(note.reminder_time).toLocaleString()}</p>
      )}
      <div className="mt-2 flex gap-4">
        <button onClick={() => onPin(note.id)} className="text-yellow-500">{note.is_pinned ? 'Unpin' : 'Pin'}</button>
        <button onClick={() => onArchive(note.id)} className="text-blue-500">Archive</button>
        <button onClick={() => onTrash(note.id)} className="text-red-500">Trash</button>
        <button onClick={() => onDelete(note.id)} className="text-gray-500">Delete</button>
      </div>
    </div>
  );
}

export default NoteCard;