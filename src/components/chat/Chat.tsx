import { getChatHistory, getRecentConversations, searchUsers, markMessagesAsRead } from '@/services/chatAPI';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebSocket } from '@/layouts/AppLayout';

interface ChatMessage {
    sender: string;
    content: string;
    timestamp: string;
    recipient: string;
    isOwnMessage?: boolean;
}

interface RecentChatItem {
    email: string;
    lastMessageContent: string;
    lastMessageTimestamp: string;
    hasNewMessages: boolean;
}

function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const chatBottomRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
    const [chatHistoryCache, setChatHistoryCache] = useState<Record<string, ChatMessage[]>>({});
    const [recentConversations, setRecentConversations] = useState<RecentChatItem[]>([]);

    const { websocket, connected, currentUserEmail, fetchRecentConversations } = useWebSocket();

    const scrollToBottom = useCallback(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (currentUserEmail) {
            const loadRecent = async () => {
                try {
                    const data = await getRecentConversations();
                    setRecentConversations(data);
                } catch (error) {
                    console.error("Error fetching recent conversations:", error);
                }
            };
            loadRecent();
        }
    }, [currentUserEmail]);

    useEffect(() => {
        if (!websocket.current) return;

        const handleWebSocketMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'private') {
                    const message: ChatMessage = {
                        sender: data.sender,
                        content: data.content,
                        timestamp: data.timestamp,
                        recipient: data.recipient,
                        isOwnMessage: data.sender === currentUserEmail,
                    };

                    const chatKey = [message.sender, message.recipient].sort().join('-');

                    setChatHistoryCache((prevHistory) => {
                        const currentChatMessages = prevHistory[chatKey] || [];
                        const isDuplicateInCache = currentChatMessages.some(
                            (m) => m.content === message.content && m.sender === message.sender && m.timestamp === message.timestamp
                        );
                        if (!isDuplicateInCache) {
                            return {
                                ...prevHistory,
                                [chatKey]: [...currentChatMessages, message],
                            };
                        }
                        return prevHistory;
                    });

                    if (activeChatUser && (
                        (message.sender === currentUserEmail && message.recipient === activeChatUser) ||
                        (message.sender === activeChatUser && message.recipient === currentUserEmail)
                    )) {
                        setMessages((prevMessages) => {
                            const isDuplicateInDisplay = prevMessages.some(
                                (m) => m.content === message.content && m.sender === message.sender && m.timestamp === message.timestamp
                            );
                            if (!isDuplicateInDisplay) {
                                return [...prevMessages, message];
                            }
                            return prevMessages;
                        });
                    }
                } else if (data.type === 'userSearchResults') {
                    setSearchResults(data.results || []);
                } else if (data.type === 'error') {
                    console.error('WebSocket error:', data.message);
                }
            } catch (error) {
                console.error('WebSocket parse error:', error);
            }
        };

        websocket.current.addEventListener('message', handleWebSocketMessage);

        return () => {
            websocket.current?.removeEventListener('message', handleWebSocketMessage);
        };
    }, [activeChatUser, currentUserEmail, fetchRecentConversations, websocket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            try {
                const results = await searchUsers(searchQuery.trim());
                setSearchResults(results.filter(email => email !== currentUserEmail));
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const startChatWithUser = async (userEmail: string) => {
        if (!currentUserEmail) return;

        setActiveChatUser(userEmail);
        setSearchQuery('');
        setSearchResults([]);

        const chatKey = [currentUserEmail, userEmail].sort().join('-');

        if (chatHistoryCache[chatKey]) {
            setMessages(chatHistoryCache[chatKey]);
        } else {
            try {
                const history = await getChatHistory(userEmail);
                const formattedHistory = history.map(msg => ({
                    ...msg,
                    isOwnMessage: msg.sender === currentUserEmail
                }));

                setChatHistoryCache(prevHistory => ({
                    ...prevHistory,
                    [chatKey]: formattedHistory
                }));
                setMessages(formattedHistory);
            } catch (error) {
                console.error('Chat history error:', error);
                setMessages([]);
            }
        }

        try {
            if (currentUserEmail) {
                await markMessagesAsRead(currentUserEmail, userEmail);
            }
        } catch (error) {
            console.error('Mark as read error:', error);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && activeChatUser && currentUserEmail && connected && websocket.current?.readyState === WebSocket.OPEN) {
            const messageToSend = {
                type: 'private',
                recipient: activeChatUser,
                content: newMessage,
            };
            websocket.current.send(JSON.stringify(messageToSend));
            setNewMessage('');
        }
    };

    return (
        <div className="bg-gray-800 text-white min-h-screen p-2 sm:p-4 flex flex-col md:flex-row">
            <aside className="w-full md:w-1/4 bg-gray-900 rounded-md shadow-md p-3 md:mr-4 mb-4 md:mb-0">
                <h3 className="text-md sm:text-lg font-semibold text-gray-300 mb-2">Chats</h3>
                <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white focus:ring focus:ring-orange-500"
                    />
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                        Buscar
                    </button>
                </form>
                {searchResults.length > 0 && (
                    <ul className="mt-2 border border-gray-700 rounded-md bg-gray-800 max-h-40 overflow-auto custom-scrollbar">
                        {searchResults.map((user) => (
                            <li
                                key={user}
                                onClick={() => startChatWithUser(user)}
                                className="p-2 hover:bg-gray-700 cursor-pointer text-gray-300 text-sm"
                            >
                                {user}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-4">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-300 mb-2">Recientes</h4>
                    <ul className="border border-gray-700 rounded-md bg-gray-800 overflow-auto max-h-64 custom-scrollbar">
                        {recentConversations.length === 0 && <li className="p-2 text-gray-500">No hay chats recientes.</li>}
                        {recentConversations.map((conv) => (
                            <li
                                key={conv.email}
                                onClick={() => startChatWithUser(conv.email)}
                                className={`p-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center text-sm ${activeChatUser === conv.email ? 'bg-gray-700' : ''}`}
                            >
                                <div className="flex flex-col max-w-[180px] overflow-hidden">
                                    <span className="font-semibold text-gray-300 truncate">{conv.email}</span>
                                    <span className="text-xs text-gray-400 truncate">{conv.lastMessageContent}</span>
                                </div>
                                {conv.hasNewMessages && (
                                    <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Nuevo</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <div className="flex-grow bg-gray-800 rounded-md shadow-md p-3 flex flex-col h-[75vh] sm:h-auto">
                <div className="overflow-y-auto mb-4 flex-grow custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px - 64px - 16px - 16px)' }}>
                    {activeChatUser && (
                        <h5 className="text-md sm:text-lg font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-2">
                            Chat con {activeChatUser}
                        </h5>
                    )}
                    <ul className="space-y-2 flex flex-col">
                        {messages.length === 0 && !activeChatUser && <li className="text-center text-gray-500">Selecciona un usuario para chatear.</li>}
                        {messages.length === 0 && activeChatUser && <li className="text-center text-gray-500">No hay mensajes en este chat.</li>}
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`p-2 rounded-md break-words max-w-[85%] sm:max-w-[70%] text-sm ${
                                    msg.isOwnMessage
                                        ? 'bg-orange-600 text-white self-end ml-auto'
                                        : 'bg-gray-700 text-gray-300 self-start'
                                }`}
                            >
                                <strong>{msg.isOwnMessage ? 'Tú' : msg.sender}:</strong> <span className="ml-1"><br/>{msg.content}</span>
                                <span className="text-xs text-gray-400 block text-right">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </li>
                        ))}
                        <div ref={chatBottomRef} />
                    </ul>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.currentTarget.value)}
                        placeholder={activeChatUser ? `Mensaje a ${activeChatUser}...` : 'Selecciona un usuario para chatear'}
                        className="flex-grow p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                        disabled={!activeChatUser || !connected}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md"
                        disabled={!activeChatUser || !connected || !newMessage.trim()}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;