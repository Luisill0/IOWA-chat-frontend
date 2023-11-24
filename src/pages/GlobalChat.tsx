import { useContext, useEffect, useState } from 'react';

import { ChatBox } from 'components/ChatBox';
import { MessageForm } from 'components/MessageForm';
import { NavbarApp } from 'components/Navbar';

import { AppContext, AppContextType } from 'context/AppContext';
import { ChatMessage } from 'interface/ChatMessage';

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"

export const GlobalChat = (): JSX.Element => {
  const { socket, userDoc } = useContext(AppContext) as AppContextType;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if(socket.hasListeners("chat-message")) return;

    const addMessage = (message: ChatMessage) => {
      console.log("add message", message);
      setMessages(prevMessages => [...prevMessages, message]);
    };
    socket.on("chat-message", addMessage);

    return () => {
      socket.off("chat-message", addMessage);
    }
  }, [])

  const onSendMessage = (e: React.FormEvent<HTMLFormElement>, messageString: string) => {
    e.preventDefault();
    const message: ChatMessage = {
      user: userDoc?.username ?? "anonymous",
      message: messageString,
      time: new Date(),
      sent: true,
    }
    console.log(message);
    socket.emit("chat-message", message);
    setMessages(prevMessages => [...prevMessages, message]);
  }

  return (
    <div id='chat-app'
      className='text-center'
    >
      <NavbarApp />
      <ChatBox messages={messages} />
      <MessageForm onSendMessage={onSendMessage} />
    </div>
  )
}
