import { Flex, Image, Text, Input, Button, Loader } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaMoon, FaPlus, FaShoppingCart } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useAddToCartMutation,
} from "./api";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Logo from "./assets/logo.svg";
import { useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useClickAway } from "ahooks";
import { SellMenu } from "./components/ui/SellMenu";

export const App = () => {
  const { data, isFetching } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteProduct] = useDeleteProductMutation();
  const [addToCart] = useAddToCartMutation();
  const sellMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchElement, setSearchElement] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleInputValueSaver = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  useClickAway(() => {
    sellMenuRef.current!.style.display = "none";
  }, headerRef);

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

  interface Product {
    title: string;
    price: number;
    description?: string;
    image?: string;
    isDeletable?: boolean;
    curr: string;
  }

  const handleAddToCartButtonClicked = async (product: Product) => {
    try {
      await addToCart({
        title: product.title,
        image: product.image,
        price: product.price,
        description: product.description,
        curr: product.curr,
      });
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const toggleDarkMode = (darkMode: boolean) => {
    document.body.classList.toggle("dark-mode", darkMode);
    window.localStorage.setItem("darkMode", String(darkMode));
  };

  useEffect(() => {
    const darkMode = window.localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  return (
    <Flex width={"100vw"} height={"100vh"} flexDirection={"column"}>
      <header
        style={{ width: "100%", position: "fixed", zIndex: "1000" }}
        ref={headerRef}
      >
        <Flex
          p={4}
          gap={4}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
          boxShadow={"md"}
          wrap={"wrap"}
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
                  handleInputValueSaver(event as unknown as React.FormEvent<HTMLFormElement>)
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
        <SellMenu innerRef={sellMenuRef}/>
      </header>
      <Flex
        wrap={"wrap"}
        width={"100%"}
        flex={1}
        overflow={"auto"}
        p={4}
        mt={"60px"}
        gap={4}
        alignItems={"flex-start"}
        className={"cards"}
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
            .map((product) => (
              <Flex
                direction={"column"}
                gap={2}
                overflow={"hidden"}
                className={"card"}
                backgroundColor={"#cccbcb"}
                borderRadius={"md"}
                key={product.id}
                minW={"300px"}
                maxW={"600px"}
                h={"300px"}
                transitionDuration={"700ms"}
                _hover={{
                  padding: 12,
                }}
              >
                <Flex
                  direction={"column"}
                  width={"100%"}
                  flex={1}
                  overflow={"hidden"}
                  onClick={() => navigate(`/product/${product.id}`)}
                  p={4}
                >
                  <Flex maxH={"50px"} overflow={"hidden"}>
                    <Text fontSize={"32px"}>{product.title}</Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    flex={1}
                    maxH={"80px"}
                    overflow={"hidden"}
                  >
                    <Image src={product.image} maxH={"100%"} />
                  </Flex>
                  <Flex
                    direction="column"
                    gap={2}
                    pr={2}
                    maxH={"100px"}
                    overflowY={"auto"}
                    border={"1px solid rgba(0,0,0,0.04)"}
                    bg={"transparent"}
                  >
                    <Text fontSize="24px">
                      {product.price}
                      {product.curr}
                    </Text>
                    <Text fontSize="sm" whiteSpace={"normal"}>
                      {product.description}
                    </Text>
                  </Flex>
                </Flex>
                {product.isDeletable == true ? (
                  <Button onClick={() => handleDeleteButton(product.id!)}>
                    Delet it!
                  </Button>
                ) : (
                  <Button onClick={() => handleAddToCartButtonClicked(product)}>
                    Ad to cart!
                  </Button>
                )}
              </Flex>
            ))
        ) : (
          data?.map((product) => (
            <Flex
              direction={"column"}
              backgroundColor={"#cccbcb"}
              borderRadius={"md"}
              p={3}
              key={product.id}
              transitionDuration={"700ms"}
              _hover={{
                padding: 12,
              }}
            >
              <Flex
                direction={"column"}
                onClick={() => navigate(`/product/${product.id}`)}
                minW={"300px"}
                maxW={"600px"}
                minH={"550px"}
                p={4}
                gap={4}
              >
                <Flex>
                  <Text fontSize={"32px"}>{product.title}</Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Image src={product.image} />
                </Flex>
                <Flex direction={"column"} p={4} gap={4}>
                  <Text fontSize={"24px"}>
                    {product.price}
                    {product.curr}
                  </Text>
                  <Text>{product.description}</Text>
                </Flex>
              </Flex>
              {product.isDeletable === true ? (
                <Button onClick={() => handleDeleteButton(product.id!)}>
                  Delet it!
                </Button>
              ) : (
                <Button onClick={() => handleAddToCartButtonClicked(product)}>
                  Ad to cart!
                </Button>
              )}
            </Flex>
          ))
        )}
      </Flex>
    </Flex>
  );
};
