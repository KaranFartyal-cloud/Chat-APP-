import React, { useState } from "react";
import { position, useToast } from "@chakra-ui/react";
import {
  Stack,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pic, setPic] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = async (pic) => {
    setloading(true);
    if (pic === undefined) {
      //if not pic then toast saying please select image
      toast({
        title: "please select an image",
        status: "",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return; //do nothing else
    }

    if (pic.type === "image/jpg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dsixpdfy7");
      const res = await fetch(//send the img to cloudinary
        "https://api.cloudinary.com/v1_1/dsixpdfy7/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploadImageUrl = await res.json();
      setPic(uploadImageUrl.url);//set pic to the url
      console.log(uploadImageUrl.url);

      setloading(false);
    }
  };

  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "please fill all the details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setloading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password does not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    try {
      const config = {//since we are only receiving json data
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(//we send the post request to this endpoint . see userRoutes.js
        "/api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");//when we store the user send them to the chats page
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setloading(false);
    }
  };

  function handleClick() {
    setShow((prev) => !prev);
  }
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired id="first-name">
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired id="Email">
        <FormLabel>Email</FormLabel>
        <Input
          type="Email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired id="Password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement marginLeft={"3px"} onClick={handleClick}>
            <Button h={"1.75rem"} size={"sm"}>
              {show ? "show" : "hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired id="Password">
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement marginLeft={"3px"} onClick={handleClick}>
            <Button h={"1.75rem"} size={"sm"}>
              {show ? "show" : "hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload your Pic</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        width={"100%"}
        colorScheme="blue"
        marginTop={15}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
