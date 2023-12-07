import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import { io } from "socket.io-client";
import Dashboard from "../components/Dashboard";
import Chat from "../components/Chat";
import "../css/ChatApp.css";

// const socket = io("http://localhost:8080");
const socket = io("https://nouveau-app.azurewebsites.net");

const ChatApp = () => {
  const userid = Number(sessionStorage.getItem("userid"));
  const newUser = sessionStorage.getItem("name");
  const role = sessionStorage.getItem("role");
  console.log(userid, newUser);

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const checkIfUserExists = useCallback(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      socket.auth = { sessionId: sessionId };
      socket.connect();
    }
  }, [socket]);

  useEffect(() => {
    checkIfUserExists();
    socket.auth = { username: newUser };
    socket.connect();
    socket.on("users", (users) => {
      setUsers(users);
      console.log(users);
    });

    socket.on("session", ({ sessionId, userId, username }) => {
      socket.auth = { sessionId: sessionId };
      localStorage.setItem("sessionId", sessionId);
      setUser({ userId, username });
    });
  }, [socket, messages, checkIfUserExists, newUser]);

  // const handleChange = (e) => {
  //   setNewUser(e.target.value);
  // };

  const logNewUser = () => {
    socket.auth = { username: newUser };
    socket.connect();
  };

  return (
    <>
      <Dashboard role={role} />
      <main className="content">
        <div className="container mt-3">
          {user.userId && (
            <Chat
              user={user}
              users={users}
              setUsers={setUsers}
              messages={messages}
              setMessages={setMessages}
              socket={socket}
            />
          )}
          {/* {!user.userId && (
          <Login
            newUser={newUser}
            handleChange={handleChange}
            logNewUser={logNewUser}
          />
        )} */}
        </div>
      </main>
    </>
  );
};

export default ChatApp;
