import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../useAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please put something inside it",
        position: "top-left",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        position: "top-left",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error.message);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      console.log(data);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //chat has nothing for now
      toast({
        title: "Chat is loaded",
        position: "bottom",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
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

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        bg={"white"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="search users" hasArrow placement="bottom">
          <Button variant={"ghost"} alignContent={"center"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4px"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize={"2xl"} />
            </MenuButton>

            {/* <MenuList></MenuList> */}
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                name={user.name}
                size={"sm"}
                src={user.pic}
                cursor={"pointer"}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                {/* here my profile is passed as children */}
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent alignContent={"center"}>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
                width={"75%"}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              // <Spinner ml={"auto"} display={"flex"} />
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}

            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
