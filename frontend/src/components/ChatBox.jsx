import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";

const ChatBox = () => {
  const { selectedChat } = ChatState();
  // useEffect(() => {
  //   console.log(selectedChat);
  // }, [selectedChat]);

  return <div>ChatBox</div>;
};

export default ChatBox;
