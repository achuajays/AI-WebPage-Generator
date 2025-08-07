import React, { useState } from 'react';
import Modal from './Modal';
import { ToastType } from '../types';
import { editHtmlFromText } from '../services/htmlGeneratorService';
import Spinner from './Spinner';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    html: string;
    setHtml: (html: string) => void;
    addToast: (message: string, type: ToastType) => void;
}

type DeviceView = 'desktop' | 'tablet' | 'mobile';

const deviceConfig: Record<DeviceView, { wrapperClasses: string; iframeClasses: string; }> = {
    desktop: {
        wrapperClasses: "w-full bg-gray-50 dark:bg-gray-900",
        iframeClasses: "w-full h-full border-0",
    },
    tablet: {
        wrapperClasses: "w-full flex items-center justify-center p-4 sm:p-6 bg-gray-200 dark:bg-gray-700",
        iframeClasses: "w-[768px] h-[1024px] max-w-full max-h-full rounded-2xl shadow-2xl bg-white border-[10px] border-black",
    },
    mobile: {
        wrapperClasses: "w-full flex items-center justify-center p-4 sm:p-6 bg-gray-200 dark:bg-gray-700",
        iframeClasses: "w-[375px] h-[812px] max-w-full max-h-full rounded-[40px] shadow-2xl bg-white border-[12px] border-black",
    },
};

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, html, setHtml, addToast }) => {
    const [modalView, setModalView] = useState<'preview' | 'code'>('preview');
    const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
    const [refinePrompt, setRefinePrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleRefineHtml = async () => {
        if (!refinePrompt.trim()) {
            addToast('Refinement instruction cannot be empty.', ToastType.Error);
            return;
        }
        setIsEditing(true);
        try {
            const newHtml = await editHtmlFromText(html, refinePrompt);
            setHtml(newHtml);
            addToast('Page updated successfully!', ToastType.Success);
            setRefinePrompt('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addToast(errorMessage, ToastType.Error);
        } finally {
            setIsEditing(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(html);
        addToast('Code copied to clipboard!', ToastType.Success);
    };

    const handleDownloadHtml = () => {
        if (!html) {
            addToast('There is no HTML to download.', ToastType.Error);
            return;
        }
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addToast('File download started!', ToastType.Success);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generated Page">
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-900 rounded-md">
                        <button onClick={() => setModalView('preview')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${modalView === 'preview' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                            Preview
                        </button>
                        <button onClick={() => setModalView('code')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${modalView === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                            Code
                        </button>
                    </div>

                    {modalView === 'preview' && (
                        <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-900 rounded-md">
                            {(['desktop', 'tablet', 'mobile'] as DeviceView[]).map((view) => (
                                <button key={view} onClick={() => setDeviceView(view)} className={`p-1.5 rounded-md transition-colors ${deviceView === view ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                                    {view === 'desktop' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                    {view === 'tablet' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                                    {view === 'mobile' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M6 21h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <button onClick={handleDownloadHtml} className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                        </button>
                        <button onClick={handleCopyToClipboard} className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            Copy Code
                        </button>
                    </div>
                </div>
                <div className={`flex-grow overflow-auto transition-colors duration-300 ${modalView === 'preview' ? deviceConfig[deviceView].wrapperClasses : 'bg-gray-50 dark:bg-gray-900'}`}>
                    {modalView === 'preview' ? (
                        <iframe
                            srcDoc={html}
                            title="Generated HTML Preview"
                            className={`transition-all duration-300 ease-in-out transform ${deviceConfig[deviceView].iframeClasses}`}
                            sandbox="allow-scripts allow-same-origin"
                        />
                    ) : (
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 focus:ring-0 focus:outline-none resize-none"
                            spellCheck="false"
                        />
                    )}
                </div>
                <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={refinePrompt}
                            onChange={(e) => setRefinePrompt(e.target.value)}
                            placeholder="e.g., Make the header background blue"
                            className="flex-grow bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                            disabled={isEditing}
                            onKeyDown={(e) => e.key === 'Enter' && !isEditing && handleRefineHtml()}
                        />
                        <button
                            onClick={handleRefineHtml}
                            disabled={isEditing || !html}
                            className="w-40 flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isEditing ? <><Spinner /> Refining...</> : 'Refine with AI'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PreviewModal;
