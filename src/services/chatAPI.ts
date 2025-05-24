import api from "@/lib/axios";
import { isAxiosError } from "axios";

export interface ChatUser {
    email: string;
    name?: string;
}

export interface ChatMessage {
    sender: string;
    content: string;
    timestamp: string;
    recipient: string; 
    isOwnMessage?: boolean;
}

export interface RecentConversation {
    email: string;
    lastMessageContent: string;
    lastMessageTimestamp: string;
    hasNewMessages: boolean;
}

export async function searchUsers(query: string): Promise<string[]> {
    try {
        const url = `/users?query=${encodeURIComponent(query)}`;
        console.log("Calling searchUsers API:", url);
        console.log(query)
        const { data } = await api.get<string[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.error("Error en searchUsers:", error.response.data);
            throw new Error(error.response.data.error || "Error buscando usuarios");
        }
        console.error("Error desconocido en searchUsers:", error);
        throw error;
    }
}

export async function getChatHistory(otherUserEmail: string): Promise<ChatMessage[]> {
    try {
        const url = `/chat/history/${encodeURIComponent(otherUserEmail)}`;
        console.log("Calling getChatHistory API:", url);
        const { data } = await api.get<ChatMessage[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.error("Error en getChatHistory:", error.response.data);
            throw new Error(error.response.data.error || "Error cargando historial");
        }
        console.error("Error desconocido en getChatHistory:", error);
        throw error;
    }
}

export async function getRecentConversations(): Promise<RecentConversation[]> {
    try {
        const url = `/chat/recent-conversations`;
        console.log("Calling getRecentConversations API:", url);
        const { data } = await api.get<RecentConversation[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.error("Error en getRecentConversations:", error.response.data);
            throw new Error(error.response.data.error || "Error cargando conversaciones recientes");
        }
        console.error("Error desconocido en getRecentConversations:", error);
        throw error;
    }
}

export async function markMessagesAsRead(recipientEmail: string, senderEmail: string): Promise<void> {
    try {
        const url = `/chat/mark-as-read`;
        console.log("Calling markMessagesAsRead API:", url, { recipientEmail, senderEmail });
        await api.post(url, { recipientEmail, senderEmail });
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.error("Error en markMessagesAsRead:", error.response.data);
            throw new Error(error.response.data.error || "Error marcando mensajes como leídos");
        }
        console.error("Error desconocido en markMessagesAsRead:", error);
        throw error;
    }
}