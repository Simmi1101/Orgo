import React, { useState, useEffect } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmojiPicker from "emoji-picker-react";
import { FaPaperclip, FaFile } from "react-icons/fa";
import { MdInsertPhoto } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const ChatInput = ({ handleSendMsg, handleSendFile }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [modal, setModal] = useState(false);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
  ];

  const toastOptions = {
    position: "top-right",
    pauseOnHover: "true",
    draggable: "true",
    theme: "light"
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Invalid file type. Only images and PDFs are allowed.');
    }
  };

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emoji) => {
    setMsg(prevMsg => prevMsg + event.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  const sendFile = () => {
    if (file) {
      handleSendFile(file);
      setFile(null);
    }
  };

  useEffect(() => {
    if (file) {
      setModal(false);
    }
  }, [file]);

  return (
    <>
      <div className="flex flex-row items-center p-4 bg-[#001845]">
        <div className="flex items-center gap-4 flex-grow mb-4">
          <div className="relative">
            <BsEmojiSmileFill
              className="text-yellow-400 cursor-pointer text-xl"
              onClick={handleEmojiPickerHideShow}
            />
            {showEmojiPicker && (
              <div className="absolute top-[-500px] sm:top-[-470px] bg-[#080420] shadow-lg border-spacing-1 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>  
          <div className="relative">
            <button
              className="text-blue-600 hover:text-blue-800 text-xl"
              onClick={() => setModal(!modal)}
            >
              <FaPaperclip />
            </button>
            <Modal
              className="w-full sm:w-[15rem] text-[#00b2ca] bg-white p-4 absolute top-[-220px] left-96 transform -translate-x-1/2 rounded-lg shadow-lg"
              isOpen={modal}
              toggle={() => setModal(!modal)}
            >
              {file ? (
                <>
                  <ModalHeader className="text-2xl">Selected File</ModalHeader>
                  <ModalBody className="flex flex-col gap-4">
                    <p><span className="font-bold text-[#023e8a]">File Name: </span>{file.name}</p>
                    <p><span className="font-bold text-[#023e8a]">File Size: </span>{file.size}</p>
                    <button
                      className="bg-transparent text-blue-600 hover:text-blue-800 flex items-center ml-auto"
                      onClick={()=>sendFile()}
                      type="button"
                    >
                      <IoSend size="1.4rem" />
                    </button>
                  </ModalBody>
                </>
              ) : (
                <>
                  <ModalHeader>Select File:</ModalHeader>
                  <ModalBody className="flex flex-col gap-4">
                    <input
                      type="file"
                      accept=".pdf, .txt"
                      id="uploadIcon"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="uploadIcon" className="flex items-center gap-2 cursor-pointer">
                      <FaFile className="text-blue-600" /> Document
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      id="photos"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="photos" className="flex items-center gap-2 cursor-pointer">
                      <MdInsertPhoto className="text-blue-600" /> Photos
                    </label>
                  </ModalBody>
                </>
              )}
            </Modal>
          </div>
        </div>
        <form
          className="flex items-center bg-[#ffffff34] mx-3 px-4 py-2 rounded-full sm:half md:w-full"
          onSubmit={sendChat}
        >
          <input
            type="text"
            placeholder="Type your message....."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-grow bg-transparent text-white border-none px-1 py-2 text-lg placeholder-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#023e7d] p-2 rounded-full flex items-center justify-center ml-2"
          >
            <IoMdSend className="text-white text-2xl" />
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default ChatInput;
