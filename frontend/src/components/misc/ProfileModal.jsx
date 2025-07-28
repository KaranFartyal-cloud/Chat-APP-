import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* when we are receiving children it means we are receiving that my profile menu item element from side drawer.jsx */}
      {children ? (
        <Box onClick={onOpen}>{children}</Box>
      ) : (
        <Box onClick={onOpen}>
          <ViewIcon height={5} cursor={"pointer"} />
        </Box>
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            gap={"5px"}
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src={user.pic}
              alt={user.name}
              borderRadius="full"
              boxSize="150px"
            />
            <Text fontSize={"xl"}>{user.email}</Text>
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"center"}>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
