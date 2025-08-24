import React from 'react';

const ChatMobileBar = ({ onToggleSidebar, onNewChat }) => (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 shadow sticky top-0 z-20 md:hidden">
        <button
            className="text-white rounded-lg p-2 hover:bg-gray-800"
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
        >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        </button>
        <span className="font-bold text-white text-lg sm:text-xl">ChatGPT</span>
        <button
            className="bg-purple-600 text-white px-2 py-1 rounded-lg font-semibold hover:bg-purple-700 text-sm sm:text-base"
            onClick={onNewChat}
            aria-label="New chat"
        >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
    </div>
);

export default ChatMobileBar;
