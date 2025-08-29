import React, { useCallback, useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    ensureInitialChat,
    startNewChat,
    selectChat,
    setInput,
    sendingStarted,
    sendingFinished,
    addUserMessage,
    addAIMessage,
    setChats
} from '../store/chatSlice.js';

const Home = () => {
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chat.chats);
    const activeChatId = useSelector(state => state.chat.activeChatId);
    const input = useSelector(state => state.chat.input);
    const isSending = useSelector(state => state.chat.isSending);
    const activeChat = chats.find(c => c.id === activeChatId) || null;
    const messages = activeChat ? activeChat.messages : [];
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [socket, setSocket] = useState(null);

    const getMessages = async (chatId) => {
        const response = await axios.get(
            `http://localhost:3000/api/chat/${chatId}`,
            { withCredentials: true }
        );
        // Update only the selected chat's messages in Redux
        dispatch(setChats(
            chats.map(chat =>
                chat.id === chatId
                    ? { ...chat, messages: (response.data.messages || []).map(m => ({
                        id: m._id || m.id,
                        role: m.role,
                        content: m.content,
                        ts: m.ts || Date.now()
                    })) }
                    : chat
            )
        ));
    };

    const handleNewChat = async () => {
        let title = window.prompt('Enter a title for the new chat:', '');
        if (title) title = title.trim();
        if (!title) return;

        const response = await axios.post(
            "http://localhost:3000/api/chat",
            { title },
            { withCredentials: true }
        );

        getMessages(response.data.chat._id);
        dispatch(startNewChat({
            id: response.data.chat._id,
            title: response.data.chat.title
        }));
        setSidebarOpen(false);
    };

    useEffect(() => {
        axios.get("http://localhost:3000/api/chat", { withCredentials: true })
            .then(response => {
                dispatch(setChats(response.data.chats.reverse()));
            });

        const tempSocket = io("http://localhost:3000/", { withCredentials: true });
        setSocket(tempSocket);

        tempSocket.on("ai-response", (messagePayload) => {
            dispatch(addAIMessage(activeChatId, messagePayload.content));
            dispatch(sendingFinished());
        });

        return () => {
            tempSocket.disconnect();
        };
    }, [dispatch, activeChatId]);

    const sendMessage = useCallback(() => {
        const trimmed = input.trim();
        if (!trimmed || !activeChatId || isSending) return;
        dispatch(sendingStarted());
        dispatch(addUserMessage(activeChatId, trimmed));
        dispatch(setInput(''));
        if (socket) {
            socket.emit('ai-message', { chat: activeChatId, content: trimmed });
        }
    }, [input, activeChatId, isSending, dispatch, socket]);

    const handleSelectChat = (chatId) => {
        dispatch(selectChat(chatId));
        getMessages(chatId);
        setSidebarOpen(false);
    };

    const handleInputChange = (value) => {
        dispatch(setInput(value));
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        // 1. Add user message to Redux
        dispatch(addUserMessage(activeChatId, input));
        dispatch(setInput("")); // clear input
        dispatch(sendingStarted());
        try {
            // 2. Send to backend
            const res = await axios.post("http://localhost:3000/api/chat/${activeChatId}/messages",
                { message: input },
                { withCredentials: true }
            );

            // 3. Add AI response to Redux
            dispatch(addAIMessage(activeChatId, res.data.reply));
        } catch (err) {
            console.error(err);
            dispatch(addAIMessage(activeChatId, "⚠️ Error talking to AI", true));
        } finally {
            dispatch(sendingFinished());
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col md:flex-row">
            <ChatMobileBar
                onToggleSidebar={() => setSidebarOpen(o => !o)}
                onNewChat={handleNewChat}
            />
            <ChatSidebar
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                open={sidebarOpen}
            />
            {sidebarOpen && (
                <button
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <main className="flex-1 flex">
                <div className="w-full md:max-w-full bg-gray-900 shadow-lg p-4 sm:p-8 min-h-[60vh] flex flex-col justify-end z-10">
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
                        setInput={handleInputChange}
                        onSend={sendMessage}
                        isSending={isSending}
                    />
                </div>
            </main>
        </div>
    );
};

export default Home;
