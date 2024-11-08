import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Logout from './Logout';
import ChatInput from './ChatInput';
import { getAllMessageRoute, sendFileRoute, sendMessageRoute } from '../utilis/APIRoutes';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { FaRegFilePdf } from 'react-icons/fa6';

function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState([]);
    const scrollRef = useRef();

    const toastOptions = {
        position: "top-right",
        pauseOnHover: "true",
        draggable: "true",
        theme: "light",
    };

    useEffect(() => {
        if (currentChat) {
            const fetchMsgs = async () => {
                try {
                    const response = await axios.post(getAllMessageRoute, {
                        from: currentUser.username,
                        to: currentChat.username,
                    });
                    setMessages(response.data);
                    console.log("response", response);
                } catch (error) {
                    console.log("error", error);
                }
            };
            fetchMsgs();
        }
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser.username,
            to: currentChat.username,
            message: msg,
        });

        socket.current.emit("send-msg", {
            to: currentChat.username,
            from: currentUser.username,
            message: msg
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    const handleSendFile = async (sendfile) => {
        const formData = new FormData();
        formData.append("files", sendfile);
        formData.append("from", currentUser.username);
        formData.append("to", currentChat.username);
        try {
            const response = await axios.post(sendFileRoute, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const Url = response.data.data.message.text;

            socket.current.emit('send-file', {
                to: currentChat.username,
                from: currentUser.username,
                Url
            });

            if (response.status === 200) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { fromSelf: true, message: Url }
                ]);
                // toast.success(`File Sent successfully!`, toastOptions);
            } else if (response.status === 400) {
                toast.error(response.message, toastOptions);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on('file-upload', ({ Url }) => {
                setArrivalMessage({ fromSelf: false, message: Url });
            });

            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, [socket, currentChat.username]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const renderMessageContent = (message) => {
        if (message.message && message.message.startsWith('http')) {
            if (message.message.endsWith('jpg') || message.message.endsWith('png') || message.message.endsWith('jpeg')) {
                return <img src={`${message.message}?${new Date().getTime()}`} alt="File content" className="w-48 h-48 object-cover" />;
            }
            if (message.message.endsWith('pdf')) {
                return (
                    <div
                        onClick={() => window.open(`${message.message}?${new Date().getTime()}`, '_blank')}
                        className="flex items-center gap-2 w-48 h-8 text-blue-500 cursor-pointer"
                    >
                        <FaRegFilePdf className="text-blue-500 text-2xl" />
                        <p>PDF file</p>
                    </div>
                );
            }
        }
        return <p>{message.message}</p>;
    };

    return (
        <>
            {currentChat && (
                <div className="flex flex-col h-screen w-screen">
                    <div className="flex items-center justify-between bg-blue-900 p-4 text-gray-400 border-b border-gray-700">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-semibold">{currentChat.username}</h2>
                        </div>
                        <Logout />
                    </div>
                    <div className="flex-1 p-4 bg-gray-900 overflow-auto">
                        {messages.map((message) => (
                            <div ref={scrollRef} key={uuidv4()} className={`flex ${message.fromSelf ? 'justify-end' : 'justify-start'} mb-4`}>
                                <div className={`max-w-[40%] p-2 text-sm rounded-lg ${message.fromSelf ? 'bg-blue-800 text-blue-400' : 'bg-gray-600 text-gray-300'}`}>
                                    {renderMessageContent(message)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <ChatInput handleSendMsg={handleSendMsg} handleSendFile={handleSendFile} currentChat={currentChat} currentUser={currentUser} />
                </div>
            )}
            <ToastContainer />
        </>
    );
}

export default ChatContainer;
