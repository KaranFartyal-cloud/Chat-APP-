import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      bg={"purple"}
      borderRadius={"lg"}
      color={"white"}
      fontSize={12}
      m={1}
      onClick={handleFunction}
      cursor={"pointer"}
      display={"flex"}
      gap={"6px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {user.name}
      <CloseIcon />
    </Box>
  );
};

export default UserBadgeItem;
