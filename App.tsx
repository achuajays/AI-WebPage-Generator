import React, { useState } from 'react';
import { ToastMessage, ToastType } from './types';
import ToastContainer from './components/Toast';
import GeneratorPage from './pages/GeneratorPage';

const App: React.FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    
    return (
        <div className="min-h-screen">
            <header className="bg-white dark:bg-gray-800/80 shadow-sm backdrop-blur-lg sticky top-0 z-40">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                    <div className="flex items-center gap-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010-1.414l3-3a1 1 0 011.414 1.414L7.414 6l2.707 2.707a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414zm8.586 8.586a1 1 0 01-1.414 0l-3 3a1 1 0 01-1.414-1.414L12.586 14l-2.707-2.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Page Generator</h1>
                    </div>
                </div>
            </header>

            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <GeneratorPage addToast={addToast} />
                </div>
            </main>
            
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </div>
    );
};

export default App;
