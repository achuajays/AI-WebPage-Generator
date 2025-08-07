import React, { useState, useEffect } from 'react';

interface CustomizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (pattern: string | null, palette: string[] | null) => void;
    initialPattern: string | null;
    initialPalette: string[] | null;
}

const patterns = [
    { name: 'Landing Page', description: 'Hero, features, CTA, footer.' },
    { name: 'Portfolio', description: 'Showcase of projects or works.' },
    { name: 'Blog Post', description: 'Single article or post layout.' },
    { name: 'E-commerce Product', description: 'Product image, details, buy button.' },
];

const palettes = [
    { name: 'Vibrant Indigo', colors: ['#4f46e5', '#3730a3', '#a5b4fc', '#e0e7ff'] },
    { name: 'Cool Blues', colors: ['#0ea5e9', '#0284c7', '#7dd3fc', '#e0f2fe'] },
    { name: 'Earthy Tones', colors: ['#16a34a', '#15803d', '#86efac', '#dcfce7'] },
    { name: 'Sunset Glow', colors: ['#f97316', '#ea580c', '#fdba74', '#ffedd5'] },
    { name: 'Monochrome', colors: ['#1f2937', '#4b5563', '#9ca3af', '#e5e7eb'] },
];

const CustomizeModal: React.FC<CustomizeModalProps> = ({ isOpen, onClose, onSave, initialPattern, initialPalette }) => {
    const [selectedPattern, setSelectedPattern] = useState<string | null>(initialPattern);
    const [selectedPalette, setSelectedPalette] = useState<string[] | null>(initialPalette);
    const [customPalette, setCustomPalette] = useState<string[]>([]);
    const [newColor, setNewColor] = useState<string>('#4f46e5');

    useEffect(() => {
        setSelectedPattern(initialPattern);
        setSelectedPalette(initialPalette);
        // If the initial palette isn't one of the presets, assume it's a custom one.
        if (initialPalette && !palettes.some(p => JSON.stringify(p.colors) === JSON.stringify(initialPalette))) {
            setCustomPalette(initialPalette);
        } else if (!initialPalette) {
            setCustomPalette([]);
        }
    }, [initialPattern, initialPalette, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        onSave(selectedPattern, selectedPalette);
    };

    const handleClear = () => {
        setSelectedPattern(null);
        setSelectedPalette(null);
        setCustomPalette([]);
        onSave(null, null);
    };

    const handleAddColor = () => {
        if (customPalette.length < 8 && newColor && !customPalette.includes(newColor)) {
            const newCustomPalette = [...customPalette, newColor];
            setCustomPalette(newCustomPalette);
            setSelectedPalette(newCustomPalette);
        }
    };

    const handleRemoveColor = (colorToRemove: string) => {
        const newCustomPalette = customPalette.filter(c => c !== colorToRemove);
        setCustomPalette(newCustomPalette);
        if (JSON.stringify(selectedPalette) === JSON.stringify(customPalette)) {
            setSelectedPalette(newCustomPalette.length > 0 ? newCustomPalette : null);
        }
    };
    
    const handleSelectCustom = () => {
        if (customPalette.length > 0) {
            setSelectedPalette(customPalette);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customize Page Design</h2>
                    <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" aria-label="Close modal">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1. Choose a Layout</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {patterns.map(p => (
                                <button key={p.name} onClick={() => setSelectedPattern(p.name === selectedPattern ? null : p.name)} className={`p-4 border rounded-lg text-left transition-all duration-200 ${selectedPattern === p.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 ring-2 ring-indigo-500' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}`}>
                                    <p className="font-semibold text-gray-800 dark:text-white">{p.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2. Select a Color Palette</h3>
                        <div className="space-y-3">
                            {palettes.map(p => (
                                <button key={p.name} onClick={() => setSelectedPalette(JSON.stringify(p.colors) === JSON.stringify(selectedPalette) ? null : p.colors)} className={`w-full p-3 border rounded-lg text-left transition-all duration-200 flex items-center justify-between ${JSON.stringify(selectedPalette) === JSON.stringify(p.colors) ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 ring-2 ring-indigo-500' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}`}>
                                    <span className="font-semibold text-gray-800 dark:text-white">{p.name}</span>
                                    <div className="flex -space-x-2">{p.colors.map(c => <div key={c} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: c }} />)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3. Or Create Your Own</h3>
                        <div onClick={handleSelectCustom} className={`p-3 border rounded-lg transition-all duration-200 space-y-3 cursor-pointer ${JSON.stringify(selectedPalette) === JSON.stringify(customPalette) && customPalette.length > 0 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 ring-2 ring-indigo-500' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}`}>
                            <div className="flex items-center gap-4">
                                <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-10 h-10 p-0 border-none rounded-md bg-transparent cursor-pointer" title="Choose a color"/>
                                <button onClick={handleAddColor} className="flex-grow px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-900/70 dark:text-indigo-200 dark:hover:bg-indigo-900">Add Color</button>
                            </div>
                            {customPalette.length > 0 && (
                                <div className="flex flex-wrap gap-2 items-center">
                                    {customPalette.map(color => (
                                        <div key={color} className="relative group flex items-center gap-1">
                                            <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: color }}/>
                                            <button onClick={(e) => { e.stopPropagation(); handleRemoveColor(color); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                     <button onClick={handleClear} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Clear</button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizeModal;