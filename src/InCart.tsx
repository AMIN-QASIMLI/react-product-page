import { Flex, Input, Button, Image, Text, Loader } from "@chakra-ui/react";
import { MdSunny } from "react-icons/md";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaMoon, FaPlus, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Logo from "./assets/logo.svg";
import { useNavigate, useSearchParams } from "react-router";
import { useRef, useEffect, useState } from "react";
import { useGetInCartsQuery, useRemoveFromCartMutation } from "./api";
import { useClickAway } from "ahooks";
import { SellMenu } from "./components/ui/SellMenu";

export const InCart = () => {
  const { data, isFetching } = useGetInCartsQuery();
  const [deleteProduct] = useRemoveFromCartMutation();
  const headerRef = useRef<HTMLDivElement>(null);
  const sellMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchElement, setSearchElement] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleInputValueSaver = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  useClickAway(() => {
    sellMenuRef.current!.style.display = "none";
  }, headerRef);

  const toggleDarkMode = (darkMode: boolean) => {
    document.body.classList.toggle("dark-mode", darkMode);
    window.localStorage.setItem("darkMode", String(darkMode));
  };

  const handleSellMenuOpener = () => {
    if (sellMenuRef.current!.style.display === "none") {
      sellMenuRef.current!.style.display = "block";
    } else {
      sellMenuRef.current!.style.display = "none";
    }
  };

  const handleDeleteButton = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
    } catch (err) {
      console.error("Error while delete:", err);
    }
  };

  useEffect(() => {
    const darkMode = window.localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  return (
    <Flex>
      <header
        style={{ width: "100%", position: "fixed", zIndex: "1000" }}
        ref={headerRef}
      >
        <Flex
          p={4}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
          boxShadow={"md"}
        >
          <Flex gap={2} alignItems={"center"}>
            <Flex
              clipPath={"circle(50% at 50% 50%)"}
              backgroundColor={"#1E90FF"}
              p={2}
              onClick={() => navigate(-1)}
            >
              <MdOutlineArrowBackIosNew />
            </Flex>
            <MdSunny size={24} onClick={() => toggleDarkMode(false)} />/
            <FaMoon size={24} onClick={() => toggleDarkMode(true)} />
          </Flex>
          <Flex>
            <Image onClick={() => navigate("/")} src={Logo} width={"150px"} />
          </Flex>
          <Flex>
            <Flex
              gap={1}
              alignItems={"center"}
              onChange={() => setSearchElement(searchInputRef.current!.value)}
            >
              <Input
                placeholder="Search in site..."
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  handleInputValueSaver(event);
                }}
              ></Input>
            </Flex>
          </Flex>
          <Flex gap={4}>
            <Flex onClick={handleSellMenuOpener}>
              <FaPlus />
            </Flex>
            <Flex onClick={() => navigate("/inCart")}>
              <FaShoppingCart />
            </Flex>
            <Flex onClick={() => navigate("/user")}>
              <FaUserCircle />
            </Flex>
          </Flex>
        </Flex>
        <SellMenu innerRef={sellMenuRef} />
      </header>
      <main style={{ width: "100%", height: "100%" }}>
        <Flex
          wrap={"wrap"}
          width={"100%"}
          height={"100%"}
          p={4}
          gap={4}
          mt={"100px"}
          className={"cards"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {isFetching ? (
            <Loader />
          ) : searchElement !== "" ? (
            data
              ?.filter((product) =>
                product.title
                  .toLowerCase()
                  .replace(" ", "")
                  .includes(searchElement)
              )
              .map((inCart) => (
                <Flex
                  direction={"column"}
                  p={4}
                  gap={4}
                  backgroundColor={"#cccbcb"}
                  borderRadius={"md"}
                  key={inCart.id}
                  overflow={"auto"}
                  className={"card"}
                  minW={"300px"}
                  maxW={"600px"}
                  minH={"550px"}
                  transitionDuration={"700ms"}
                  _hover={{
                    padding: 12,
                  }}
                >
                  <Flex
                    direction={"column"}
                    overflow={"auto"}
                    wrap={"wrap"}
                    onClick={() => navigate(`/product/${inCart.id}`)}
                  >
                    <Flex overflow={"auto"}>
                      <Text fontSize={"32px"}>{inCart.title}</Text>
                    </Flex>
                    <Flex alignItems={"center"} justifyContent={"center"}>
                      <Image src={inCart.image} />
                    </Flex>
                    <Flex overflow={"auto"} direction={"column"} p={4} gap={4}>
                      <Text fontSize={"24px"}>
                        {inCart.price}
                        {inCart.curr}
                      </Text>
                      <Text overflow={"auto"}>{inCart.description}</Text>
                    </Flex>
                  </Flex>
                  <Button onClick={() => handleDeleteButton(inCart.id!)}>
                    Delet it!
                  </Button>
                </Flex>
              ))
          ) : (
            data?.map((inCart) => (
              <Flex
                direction={"column"}
                p={4}
                gap={4}
                backgroundColor={"#cccbcb"}
                borderRadius={"md"}
                key={inCart.id}
                minW={"300px"}
                maxW={"600px"}
                minH={"550px"}
                transitionDuration={"700ms"}
                _hover={{
                  padding: 12,
                }}
              >
                <Flex
                  direction={"column"}
                  overflow={"auto"}
                  wrap={"wrap"}
                  onClick={() => navigate(`/product/${inCart.id}`)}
                >
                  <Flex>
                    <Text fontSize={"32px"}>{inCart.title}</Text>
                  </Flex>
                  <Flex alignItems={"center"} justifyContent={"center"}>
                    <Image src={inCart.image} />
                  </Flex>
                  <Flex direction={"column"} p={4} gap={4}>
                    <Text fontSize={"24px"}>
                      {inCart.price}
                      {inCart.curr}
                    </Text>
                    <Text>{inCart.description}</Text>
                  </Flex>
                </Flex>
                <Button onClick={() => handleDeleteButton(inCart.id!)}>
                  Delet it!
                </Button>
              </Flex>
            ))
          )}
        </Flex>
        <Flex
          w={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          display={(data?.length ?? 0) > 0 ? "flex" : "none"}
        >
          <Button onClick={() => alert("You can not buy!")}>Buy!</Button>
        </Flex>
      </main>
    </Flex>
  );
};
