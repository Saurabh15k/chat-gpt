import React from 'react';

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => (
    <aside
        className={`
            fixed md:static top-0 left-0 h-[100%] md:h-[100%] 
            w-64 md:w-72 bg-gray-900 border-r border-gray-800 
            p-4 sm:p-6 gap-4 shadow-lg z-40 justify-between flex flex-col
            transform transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
        `}
    >
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-purple-400">Chats</h2>
            <button
                className="bg-purple-600 text-white px-2 py-1 rounded-lg font-semibold hover:bg-purple-700 text-sm sm:text-base"
                onClick={onNewChat}
                aria-label="New chat"
            >
                + New
            </button>
        </div>
        <ul className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {chats.length === 0 && <div className="text-gray-400 text-sm">No chats yet.</div>}
            {Array.isArray(chats) && chats.map((chat) => (
                <li
                    key={chat.id}
                    className={`py-2 px-3 rounded-lg cursor-pointer text-gray-200 font-medium mb-1 transition-colors ${
                        activeChatId === chat.id ? 'bg-purple-900' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                >
                    <div className="font-bold text-base truncate">{chat.title}</div>
                    <div className="text-xs text-gray-400">{Array.isArray(chat.messages) ? chat.messages.length : 0} messages</div>
                </li>
            ))}
        </ul>
            <button
                className='rounded bg-red-500 text-amber-50 cursor-pointer px-2 py-1 w-fit text-[0.6rem] flex justify-end'
                onClick={() => {
                    document.cookie = 'token=; Max-Age=0; path=/;';
                    window.location.reload();
                }}
            >
                Log out
            </button>
    </aside>
);

export default ChatSidebar;
