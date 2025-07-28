import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  // useEffect(() => {
  //   console.log(selectedChat);
  // }, [selectedChat]);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      width={"100%"}
      ml={"3px"}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
