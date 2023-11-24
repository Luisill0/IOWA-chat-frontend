export type ChatMessage = {
    user: string;
    message: string;
    time: Date | string;
    sent: boolean;
    room?: string;
}