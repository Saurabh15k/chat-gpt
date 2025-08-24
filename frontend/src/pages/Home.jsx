import React, { useCallback, useEffect, useState } from 'react';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';

const uid = () => Math.random().toString(36).slice(2, 11);

const Home = () => {
    // Previous chats list
    const [chats, setChats] = useState([]); // [{id, title, messages:[{id, role, content, ts}]}]
    const [activeChatId, setActiveChatId] = useState(null);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile off-canvas

    const activeChat = chats.find(c => c.id === activeChatId) || null;
    const messages = activeChat ? activeChat.messages : [];

    const startNewChat = useCallback(() => {
        const id = uid();
        const newChat = { id, title: 'New Chat', messages: [] };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(id);
        setSidebarOpen(false);
    }, []);

    // Ensure at least one chat exists initially
    useEffect(() => {
        if (!activeChatId && chats.length === 0) startNewChat();
    }, [activeChatId, chats.length, startNewChat]);

    const updateChat = useCallback((chatId, updater) => {
        setChats(prev => prev.map(c => (c.id === chatId ? updater(c) : c)));
    }, []);

    const sendMessage = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || !activeChatId || isSending) return;
        setIsSending(true);
        const userMsg = { id: uid(), role: 'user', content: trimmed, ts: Date.now() };
        updateChat(activeChatId, c => ({
            ...c,
            title: c.messages.length === 0 ? trimmed.slice(0, 40) + (trimmed.length > 40 ? '…' : '') : c.title,
            messages: [...c.messages, userMsg]
        }));
        setInput('');
        try {
            const reply = await fakeAIReply(trimmed);
            const aiMsg = { id: uid(), role: 'ai', content: reply, ts: Date.now() };
            updateChat(activeChatId, c => ({ ...c, messages: [...c.messages, aiMsg] }));
        } catch {
            const errMsg = { id: uid(), role: 'ai', content: 'Error fetching AI response.', ts: Date.now(), error: true };
            updateChat(activeChatId, c => ({ ...c, messages: [...c.messages, errMsg] }));
        } finally {
            setIsSending(false);
        }
    }, [input, activeChatId, isSending, updateChat]);

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col md:flex-row">
            {/* Mobile bar sticky at top, only on mobile */}
            <ChatMobileBar
                onToggleSidebar={() => setSidebarOpen(o => !o)}
                onNewChat={startNewChat}
            />
            {/* Sidebar overlays on mobile, fixed on desktop */}
            <ChatSidebar
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
                onNewChat={startNewChat}
                open={sidebarOpen}
            />
            {/* Sidebar backdrop for mobile overlay, outside sidebar */}
            {sidebarOpen && (
                <button
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Main chat area, full width on mobile, centered card on desktop */}
            <main className="flex-1 flex ">
                <div className="w-full md:max-w-full bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-8  min-h-[60vh] flex flex-col justify-end z-10">
                    {messages.length === 0 && (
                        <div className="bg-gradient-to-b from-purple-900 to-gray-900 rounded-2xl shadow p-6 text-center text-purple-300 max-w-md w-full mx-auto mb-4">
                            <div className="inline-block bg-purple-400 text-gray-900 font-bold rounded-full px-4 py-1 text-sm mb-3">Early Preview</div>
                            <h1 className="text-2xl font-bold text-white mb-2">ChatGPT Clone</h1>
                            <p className="text-gray-300 text-base">Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
                        </div>
                    )}
                    <ChatMessages messages={messages} isSending={isSending} />
                    <ChatComposer
                        input={input}
                        setInput={setInput}
                        onSend={sendMessage}
                        isSending={isSending}
                    />
                </div>
            </main>
        </div>
    );
};

export default Home;