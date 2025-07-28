import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
            pb={3}
            px={2}
            w={"100%"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Box>

          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {/* messages here */}
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          h={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
