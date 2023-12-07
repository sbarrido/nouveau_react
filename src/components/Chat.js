import React, { useState, useEffect, useCallback, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatContainer from "./ChatContainer";
import ChatBody from "./ChatBody";
import "../css/Chat.css";
function Chat(props) {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const currentSelecteduser = useRef({});
  const findUser = useCallback(
    (userId) => {
      const userIndex = props.users.findIndex((user) => user.userId === userId);
      return userIndex >= 0;
    },
    [props.users]
  );
  const handleConnectionStatus = useCallback(
    (userId, status) => {
      const userIndex = props.users.findIndex((u) => u.userid === userId);
      if (userIndex >= 0) {
        props.users[userIndex].connected = status;
        props.setUsers([...props.users]);
      }
    },
    [props.users, props.setUsers]
  );
  const userConnected = useCallback(
    ({ userId, username }) => {
      if (props.user.userId !== userId) {
        const userExists = findUser(userId);
        if (userExists) {
          handleConnectionStatus(userId, true);
        } else {
          const newUser = { userId, username, connected: true };
          props.setUsers([...props.users, newUser]);
        }
      }
    },
    [props.user, props.users, props.setUsers, handleConnectionStatus, findUser]
  );
  const userDisconnected = useCallback(
    (userId) => {
      handleConnectionStatus(userId, false);
    },
    [handleConnectionStatus]
  );

  const handleNewMessageStatus = useCallback(
    (userId, status) => {
      const userIndex = props.users.findIndex((u) => u.userId === userId);
      if (userIndex >= 0) {
        props.users[userIndex].hasNewmessage = status;
        props.setUsers([...props.users]);
      }
    },
    [props.setUsers, props.users]
  );
  const privateMessage = useCallback(
    ({ content, from, to }) => {
      //if user is selected
      if (currentSelecteduser.current.userId) {
        if (currentSelecteduser.current.userId === from) {
          const newMessage = {
            userId: from,
            message: content,
          };
          props.setMessages([...props.messages, newMessage]);
        } else {
          handleNewMessageStatus(from, true);
        }
      } else {
        //if user is not selected
        handleNewMessageStatus(from, true);
      }
    },
    [props.setMessages, props.messages, handleNewMessageStatus, selectedUser]
  );

  const userMessages = useCallback(
    ({ messages }) => {
      const chatMessages = [];
      messages.forEach(({ content, from }) => {
        chatMessages.push({ userId: from, message: content });
        props.setMessages([...chatMessages]);
      });
    },
    [props.setMessages]
  );
  useEffect(() => {
    props.socket.on("user connected", (user) => userConnected(user));

    props.socket.on("user disconnected", (user) => userDisconnected(user));

    props.socket.on("private message", (message) => {
      privateMessage(message);
    });

    props.socket.on("user messages", (messages) => userMessages(messages));
  }, [
    props.socket,
    userConnected,
    userDisconnected,
    privateMessage,
    userMessages,
  ]);

  const sendMessage = () => {
    props.socket.emit("private message", {
      content: message,
      to: selectedUser.userId,
    });

    const newMessage = {
      userId: props.user.userId,
      username: props.user.username,
      message,
    };
    props.setMessages([...props.messages, newMessage]);
    setMessage("");
  };

  const selectUser = (user, index) => {
    setSelectedUser({ userId: user.userId, username: user.username, index });
    props.setMessages([]);
    currentSelecteduser.current = user;
    props.socket.emit("user messages", user);
    handleNewMessageStatus(user.userId, false);
  };
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  return (
    <ChatContainer>
      <div className="d-flex flex-column col-4 col-lg-4 col-xl-4 pe-0 border-right-info">
        <div className="align-items-start py-2 px-4 w-100 border-bottom border-info d-lg-block sticky-top bg-white">
          <div className="d-flex align-items-center py-1">
            <div className="position-relative">
              <img
                src={`https://bootdey.com/img/Content/avatar/avatar${1}.png`}
                className="rounded-circle mx-2"
                alt={props.user.username}
                width="40"
                height="40"
              />
            </div>
            <div className="flex-grow-1">{props.user.username}</div>
          </div>
        </div>
        <div className="text-center bg-primary text-white">Connected Users</div>

        {props.users.length > 0 ? (
          props.users.map((user, index) => {
            console.log(user);
            return (
              <div
                key={index}
                className="py-2 px-2 border-bottom border-info d-lg-block cursor-pointer"
                onClick={() => selectUser(user, index)}
              >
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex flex-column position-relative">
                    <img
                      src={`https://bootdey.com/img/Content/avatar/avatar${
                        index + 1
                      }.png`}
                      className="rounded-circle mx-2"
                      alt={user.username}
                      width="45"
                      height="45"
                    />
                    <span
                      className={user.connected ? "online" : "offline"}
                    ></span>
                  </div>
                  <div className="d-flex flex-row position-relative w-100">
                    <strong className="me-auto">{user.username}</strong>
                    <span
                      className={
                        user.hasNewmessage ? "new-message-alert mt-2" : ""
                      }
                    ></span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="d-flex justify-content-center align-items-center chat-window">
            No Users Connected
          </div>
        )}
      </div>

      {selectedUser.userId && (
        <div className="d-flex flex-column col-8 col-lg-8 col-xl-8 ps-0 chat-window">
          <ChatHeader user={selectedUser} />
          <ChatBody user={props.user} messages={props.messages} />
          <ChatInput
            message={message}
            handleMessage={handleMessage}
            sendMessage={sendMessage}
          />
        </div>
      )}
    </ChatContainer>
  );
}

export default Chat;
