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
        const { data } = await api.get<string[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error buscando usuarios");
        }
        throw error;
    }
}

export async function getChatHistory(otherUserEmail: string): Promise<ChatMessage[]> {
    try {
        const url = `/chat/history/${encodeURIComponent(otherUserEmail)}`;
        const { data } = await api.get<ChatMessage[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error cargando historial");
        }
        throw error;
    }
}

export async function getRecentConversations(): Promise<RecentConversation[]> {
    try {
        const url = `/chat/recent-conversations`;
        const { data } = await api.get<RecentConversation[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error cargando conversaciones recientes");
        }
        throw error;
    }
}

export async function markMessagesAsRead(recipientEmail: string, senderEmail: string): Promise<void> {
    try {
        const url = `/chat/mark-as-read`;
        await api.post(url, { recipientEmail, senderEmail });
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error marcando mensajes como leídos");
        }
        throw error;
    }
}