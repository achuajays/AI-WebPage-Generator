import React, { useState } from 'react';
import { ToastType } from '../types';
import { generateHtmlFromText } from '../services/htmlGeneratorService';
import Spinner from '../components/Spinner';
import CustomizeModal from '../components/CustomizeModal';
import PreviewModal from '../components/PreviewModal';

interface GeneratorPageProps {
    addToast: (message: string, type: ToastType) => void;
}

const GeneratorPage: React.FC<GeneratorPageProps> = ({ addToast }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
    const [selectedPalette, setSelectedPalette] = useState<string[] | null>(null);


    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast('Prompt cannot be empty.', ToastType.Error);
            return;
        }
        setIsLoading(true);
        setGeneratedHtml('');
        try {
            const customization = {
                pattern: selectedPattern,
                palette: selectedPalette,
            };
            const html = await generateHtmlFromText(prompt, customization);
            setGeneratedHtml(html);
            setIsPreviewModalOpen(true);
            addToast('HTML page generated successfully!', ToastType.Success);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addToast(errorMessage, ToastType.Error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveCustomization = (pattern: string | null, palette: string[] | null) => {
        setSelectedPattern(pattern);
        setSelectedPalette(palette);
        setIsCustomizeModalOpen(false);
        if(pattern || (palette && palette.length > 0)) {
            addToast('Customizations applied!', ToastType.Success);
        } else {
            addToast('Customizations cleared.', ToastType.Success);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Text-to-HTML Page Generator</h2>
                    <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Describe the webpage you want to create, and our AI will build it for you.</p>
                </div>
                <div className="space-y-4">
                    <textarea
                        rows={8}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A modern landing page for a new coffee shop called 'The Daily Grind'. It should have a hero section with a call-to-action, a menu section with three items, and a contact form."
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                        disabled={isLoading}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                         <button
                            onClick={() => setIsCustomizeModalOpen(true)}
                            disabled={isLoading}
                            className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-500 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                             </svg>
                             Customize
                             {(selectedPattern || (selectedPalette && selectedPalette.length > 0)) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                             )}
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-3 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <><Spinner /> Generating...</> : 'Generate HTML Page'}
                        </button>
                    </div>
                </div>
            </div>
            <PreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                html={generatedHtml}
                setHtml={setGeneratedHtml}
                addToast={addToast}
            />
            <CustomizeModal 
                isOpen={isCustomizeModalOpen} 
                onClose={() => setIsCustomizeModalOpen(false)}
                onSave={handleSaveCustomization}
                initialPattern={selectedPattern}
                initialPalette={selectedPalette}
            />
        </>
    );
};

export default GeneratorPage;
