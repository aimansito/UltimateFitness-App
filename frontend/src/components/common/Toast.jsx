import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const types = {
        success: {
            bg: 'bg-green-500',
            icon: CheckCircle,
            text: 'text-white'
        },
        error: {
            bg: 'bg-red-500',
            icon: XCircle,
            text: 'text-white'
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: AlertCircle,
            text: 'text-black'
        },
        info: {
            bg: 'bg-blue-500',
            icon: Info,
            text: 'text-white'
        }
    };

    const config = types[type];
    const Icon = config.icon;

    return (
        <div className={`${config.bg} ${config.text} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="hover:opacity-75 transition-opacity"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Toast;
