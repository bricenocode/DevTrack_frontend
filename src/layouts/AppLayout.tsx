import { Link, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState, createContext, useContext, useCallback, MutableRefObject } from 'react';
import { getRecentConversations } from '@/services/chatAPI';

interface WebSocketContextType {
    websocket: React.MutableRefObject<WebSocket | null>;
    connected: boolean;
    currentUserEmail: string | null;
    fetchRecentConversations: MutableRefObject<(() => Promise<void>) | undefined>;
    websocketError: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const websocket = useRef<WebSocket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [authToken] = useState<string | null>(localStorage.getItem('AUTH_TOKEN'));
    const [websocketError, setWebsocketError] = useState<string | null>(null);

    const fetchRecentConversationsRef = useRef<(() => Promise<void>) | undefined>(undefined);

    const API_BASE_URL = import.meta.env.VITE_API_URL_WS;

    const getWebSocketUrl = useCallback(() => {
        if (!API_BASE_URL) {
            console.error("VITE_API_URL no está definida.");
            return null;
        }
        const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
        const wsBase = API_BASE_URL.replace(/^(http|https):\/\//, `${wsProtocol}://`).replace(/\/api$/, '');
        return `${wsBase}/chat-ws?token=${authToken}`;
    }, [API_BASE_URL, authToken]);


    useEffect(() => {
        if (data && data.email) {
            setCurrentUserEmail(data.email);
        }
    }, [data]);

    const fetchRecentConversations = useCallback(async () => {
        if (!currentUserEmail || !authToken) {
            console.warn('FETCH_RECENT_CONV: Falta email del usuario o token de autenticación.');
            return;
        }
        try {
            const data = await getRecentConversations();
            console.log("FETCH_RECENT_CONV: Conversaciones recientes obtenidas por AppLayout:", data);
            setWebsocketError(null);
        } catch (error) {
            console.error("FETCH_RECENT_CONV: Error al cargar conversaciones recientes:", error);
        }
    }, [currentUserEmail, authToken]);


    const connectWebSocket = useCallback(() => {
        if (!authToken || !currentUserEmail) {
            console.warn('CONNECT_WS: Falta token o email. No se puede conectar WebSocket.');
            setConnected(false);
            return;
        }

        if (websocket.current && (websocket.current.readyState === WebSocket.OPEN || websocket.current.readyState === WebSocket.CONNECTING)) {
            console.log('CONNECT_WS: WebSocket ya conectado o en proceso.');
            return;
        }

        const wsUrl = getWebSocketUrl();
        if (!wsUrl) {
            console.error('CONNECT_WS: No se pudo construir la URL del WebSocket.');
            setWebsocketError('No se pudo establecer conexión al chat. URL de backend inválida.');
            setConnected(false);
            return;
        }

        websocket.current = new WebSocket(wsUrl);

        websocket.current.onopen = () => {
            console.log('CONNECT_WS: WebSocket global CONECTADO.');
            setConnected(true);
            setWebsocketError(null);
            fetchRecentConversations();
        };

        websocket.current.onclose = (event) => {
            console.log('CONNECT_WS: WebSocket global CERRADO:', event.code, event.reason);
            setConnected(false);
            if (event.code !== 1000) {
                setWebsocketError('Error en la conexión del chat. Intentando reconectar...');
                console.log('CONNECT_WS: Reconectando en 3 segundos...');
                setTimeout(() => connectWebSocket(), 3000);
            } else {
                setWebsocketError(null);
                console.log('CONNECT_WS: Cierre normal, no se reconecta automáticamente.');
            }
        };


        websocket.current.onmessage = (event) => {
            try {
                const messageData = JSON.parse(event.data);

                if (messageData.type === 'private') {
                    if (messageData.sender !== currentUserEmail) {
                        const isNotInChatPage = location.pathname !== '/chats';

                        if (isNotInChatPage) {
                            toast.info(`Nuevo mensaje de ${messageData.sender}: "${messageData.content}"`, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                                onClick: () => {
                                    navigate('/chats');
                                }
                            });
                        }
                    }
                    if (fetchRecentConversationsRef.current) {
                        fetchRecentConversationsRef.current();
                    } else {
                         console.warn("fetchRecentConversationsRef.current no disponible para actualizar conversaciones recientes.");
                         fetchRecentConversations();
                    }
                }
            } catch (error) {
                console.error('Error al parsear o manejar el mensaje del WebSocket global:', error);
            }
        };

    }, [authToken, currentUserEmail, fetchRecentConversations, navigate, location.pathname, getWebSocketUrl]);


    useEffect(() => {
        if (websocketError) {
            toast.error(websocketError, {
                toastId: 'websocket-error',
                autoClose: false,
                closeButton: false,
                draggable: false,
                closeOnClick: false,
                theme: "dark"
            });
        } else {
            toast.dismiss('websocket-error');
        }
    }, [websocketError]);


    useEffect(() => {
        if (authToken && currentUserEmail) {
            connectWebSocket();
        }

        return () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close(1000, 'Component unmount');
            }
            websocket.current = null;
        };
    }, [authToken, currentUserEmail, connectWebSocket]);

    if(isLoading) return <p className="text-white text-2xl">Cargando...</p>
    if(isError){
        return <Navigate to='/auth/login'/>
    }

    if (data) return (
        <WebSocketContext.Provider value={{ websocket, connected, currentUserEmail, fetchRecentConversations: fetchRecentConversationsRef, websocketError }}>
            <header
                className="bg-[#0c0d0c] py-5"
            >
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-56">
                        <Link to="/">
                            <Logo/>
                        </Link>
                    </div>
                    <NavMenu name={data.name}/>
                </div>
            </header>
            <section className="max-w-screen-2xl mx-auto mt-10 p-5 min-w-[290px]">
                <Outlet/>
            </section>
            <footer className="py-5 ">
                <p className="text-center text-white">
                    Todos los derechos reservados {new Date().getFullYear()}
                </p>
            </footer>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="dark"
            />
        </WebSocketContext.Provider>
    )
}