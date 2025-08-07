
import React, { useEffect } from 'react';
import { ToastMessage, ToastType } from '../types';

interface ToastProps {
    toast: ToastMessage;
    onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [toast.id, onDismiss]);

    const baseClasses = 'flex items-center w-full max-w-xs p-4 text-white rounded-lg shadow-lg';
    const typeClasses = {
      [ToastType.Success]: 'bg-green-500',
      [ToastType.Error]: 'bg-red-600',
    };

    const icons = {
      [ToastType.Success]: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
      [ToastType.Error]: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    }

    return (
        <div className={`${baseClasses} ${typeClasses[toast.type]} animate-toast-in`}>
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                {icons[toast.type]}
            </div>
            <div className="ml-3 text-sm font-medium">{toast.message}</div>
            <button onClick={() => onDismiss(toast.id)} className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-white/50 p-1.5 hover:bg-white/20 inline-flex h-8 w-8">
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    );
};


const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: number) => void; }> = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed bottom-5 right-5 z-[100] space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

export default ToastContainer;
