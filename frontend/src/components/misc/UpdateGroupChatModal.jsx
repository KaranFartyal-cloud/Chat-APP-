import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "../useAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../useAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false); //since to this we also have to send an AAPI
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      console.log(data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        position: "bottom",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setGroupChatName("");
    // onClose();
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        position: "bottom",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User is already in the Group",

        position: "bottom",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add in the Group",

        position: "bottom",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setLoading(false);
      toast({
        title: "error occured",
        description: error.message,
        position: "bottom",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: "Only Group Admin can remove users",

        position: "bottom",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "error occured",
        description: error.message,
        position: "bottom",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display={"flex"}
              width={"100%"}
              flexWrap={"wrap"}
              paddingBottom={3}
            >
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display={"flex"} mb={3}>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant={"solid"}
                backgroundColor={"teal"}
                ml={1}
                color={"white"}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl display={"flex"}>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} flexWrap={"wrap"}>
              {loading ? (
                <Spinner size={"lg"} />
              ) : (
                searchResult
                  .slice(0, 4)
                  .map((u) => (
                    <UserListItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleAddUser(u)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
