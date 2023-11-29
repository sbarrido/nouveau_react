import React, { useEffect } from "react";
import "../css/ChatInput.css";
function ChatInput(props) {
  return (
    <div className="mt-auto align-items-end border-info py-3 px-4 border-top d-lg-block chat-input">
      <div className="input-group flex-fill">
        <input
          type="text"
          className="form-control"
          name="message"
          value={props.message}
          placeholder="Type your message..."
          onChange={props.handleMessage}
          onKeyDown={(e) => (e.code === "Enter" ? props.sendMessage() : null)}
        ></input>
        <button className="btn btn-info" onClick={() => props.sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
