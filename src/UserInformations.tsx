import React, { useEffect } from "react";
import {
  Flex,
  Text,
  Button,
  Spinner,
  IconButton,
  Image,
} from "@chakra-ui/react";
import Logo from "./assets/logo.svg";
import { Link, useNavigate } from "react-router";
import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { useGetProfileQuery } from "./api";
import { useAuthStore } from "./zustand_store";

export const UserInformations: React.FC = () => {
  const { data, isFetching, isError, error } = useGetProfileQuery();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const toggleDarkMode = (darkMode: boolean) => {
    document.body.classList.toggle("dark-mode", darkMode);
    window.localStorage.setItem("darkMode", String(darkMode));
  };

  useEffect(() => {
    const darkMode = window.localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  const user = data?.user;
  const maskedPassword = user?.password !== "" ? "••••••••" : "—";

  return (
    <Flex
      p={4}
      gap={8}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Flex gap={4} alignItems="center">
        <IconButton
          aria-label="light-mode"
          onClick={() => toggleDarkMode(false)}
          size="sm"
          variant="ghost"
        >
          <MdSunny />
        </IconButton>
        /
        <IconButton
          aria-label="dark-mode"
          onClick={() => toggleDarkMode(true)}
          size="sm"
          variant="ghost"
        >
          <FaMoon />
        </IconButton>
        <Link to="/login" style={{ marginLeft: 8 }}>
          Token expired? Login here.
        </Link>
        <Flex>
          <Image onClick={() => navigate("/")} src={Logo} width={"150px"} />
        </Flex>
      </Flex>

      {isFetching ? (
        <Spinner size="lg" />
      ) : isError ? (
        <Flex direction="column" gap={2}>
          <Text color="red.500">Error loading profile.</Text>
          <Text fontSize="sm">
            {JSON.stringify((error as any).data ?? error)}
          </Text>
          <Text>No profile data.</Text>
          <Button>
            <Link to={"/login"}>Log in</Link>
          </Button>
          <Button>
            <Link to="/register">You haven't an account yet?!</Link>
          </Button>
        </Flex>
      ) : user ? (
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          <Text>User Name: {user.first_name ?? "—"}</Text>
          <Text>User Last Name: {user.last_name ?? "—"}</Text>
          <Text>User Email: {user.email ?? "—"}</Text>
          <Text>User Password: {maskedPassword}</Text>
          <Text>User Company Name: {user.companyName ?? "—"}</Text>
          <Text>User Mobile: {user.mobile ?? "—"}</Text>
        </Flex>
      ) : (
        <Flex direction={"column"} gap={"4px"}>
          <Text>No profile data.</Text>
          <Button>
            <Link to="/login">Log in</Link>
          </Button>
          <Button>
            <Link to="/register">You haven't an account yet?!</Link>
          </Button>
        </Flex>
      )}
      <Button onClick={handleLogout} maxW={"300px"}>
        Log out
      </Button>
    </Flex>
  );
};
