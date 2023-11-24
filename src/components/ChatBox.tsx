import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChatMessage } from "../interface/ChatMessage";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"

type ChatBoxProps = {
    messages: ChatMessage[];
}

export const ChatBox = ({messages}: ChatBoxProps) => (
    <div id='chat-box'
        className="
            w-75
            mx-auto pe-2
            border-start border-end border-2
        "
        style={{
            height: '80vh',
            overflow: 'scroll'
        }}
    >
        {messages.map((message, index) => (
            <Message
                key={index}
                message={message}
            />
        )) }
    </div>
)

type MessageProps = {
    message: ChatMessage;
}

const Message = ({ message }: MessageProps) => {
    const formatDate = (datestring: string | Date) => {
        const date = new Date(datestring);
        return `${date.getHours()}:${date.getMinutes()}`
    }

    return (
        <div id='message'
            className={`
                px-3 my-3
                rounded-3
                ${message.sent ? "ms-auto" : ""}
                d-flex flex-column
            `}
            style={{
                minWidth: '300px',
                width: 'fit-content',
                backgroundColor: message.sent ? "#61CC61" : "#C5C5C5"
            }}
        >
            <MessageSender message={message} />
            <div className="d-flex justify-content-between align-items-center">
                <span className='text-start'>{message.message}</span>
                <span className="ms-3">{formatDate(message.time)}</span>
            </div>
        </div>
    )
}

type MessageSenderProps = {
    message: ChatMessage;
}

const MessageSender = ({message}: MessageSenderProps): JSX.Element => {
    const [isAnon] = useState<boolean>(message.user === "anonymous");
    const navigate = useNavigate();

    if (message.sent) return <></>;

    return (
        <span
            onClick={isAnon ? undefined : () => navigate(`/profile/${message.user}`)}
            className={`
                fs-4 fw-bold text-start
                ${isAnon ? "user-select-none" : "clickable-username"}   
            `}
        >
            {message.user}
        </span>
    )
}
