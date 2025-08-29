import React, { useRef, useLayoutEffect } from 'react';

const ChatComposer = ({ input, setInput, onSend, isSending }) => {
    const textareaRef = useRef(null);

    // Auto-expand textarea as user types
    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, [input]);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (!isSending) onSend();
            }}
            className="w-full flex items-center gap-2 py-3 px-2 sm:px-6 bg-gray-900 rounded-b-2xl shadow sticky bottom-0"
        >
            <textarea
                ref={textareaRef}
                className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-sm sm:text-base scrollbar-hide"
                rows={1}
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isSending}
                style={{ overflow: 'hidden' }}
            />
            <button
                type="submit"
                className="px-3 py-2 sm:px-4 sm:py-3 bg-purple-600 text-white font-bold rounded-xl cursor-pointer shadow hover:bg-purple-700 transition-colors flex items-center"
                disabled={isSending || !input.trim()}
                aria-label="Send message"
            >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
            </button>
        </form>
    );
};

export default ChatComposer;
