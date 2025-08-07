
import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white break-words">{note.title}</h3>
                <button
                    onClick={() => onDelete(note.id)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 ml-4"
                    aria-label="Delete note"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap flex-grow">{note.content}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
                {new Date(note.createdAt).toLocaleString()}
            </p>
        </div>
    );
};

export default NoteCard;
