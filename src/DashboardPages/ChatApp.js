import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../css/ChatApp.css";
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const socket = io(); // Assumes the server is running on the same host

  useEffect(() => {
    // Set up event listeners for incoming messages
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Run this effect only once when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      // Emit the 'chat message' event with the input value
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="chat">
      <div className="chatBox">
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <div className="chatSend">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="sendButton" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
