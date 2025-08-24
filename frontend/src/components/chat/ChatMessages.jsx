import React, { useRef, useEffect } from 'react';

const ChatMessages = ({ messages, isSending }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
    <div className="flex flex-col gap-3 py-4 px-2 sm:px-6 overflow-y-auto flex-1 scrollbar-hide justify-start">
            {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400">No messages yet.</div>
            )}
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className={`text-xs font-semibold mb-1 ${msg.role === 'user' ? 'text-purple-400' : 'text-gray-400'}`}>{msg.role === 'user' ? 'You' : 'AI'}</span>
                    <div className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl max-w-xs sm:max-w-lg break-words shadow ${msg.role === 'user' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-200'} ${msg.error ? 'border border-red-500 text-red-400' : ''}`}>{msg.content}</div>
                </div>
            ))}
            {isSending && (
                <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold mb-1 text-gray-400">AI</span>
                    <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl max-w-xs sm:max-w-lg break-words shadow bg-gray-800 text-gray-200 animate-pulse flex gap-2 items-center">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                        <span>Thinking…</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
