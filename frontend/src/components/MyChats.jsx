import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupModal from "./misc/GroupModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error fetching the Chat",
        description: error.message,
        position: "bottoms-left",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex ", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      borderRadius={"lg"}
      borderWidth={"1px"}
      w={{ base: "100%", md: "31%" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work Sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            leftIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupModal>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        width={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
