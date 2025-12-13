import { Flex, Image, Text, Button, Loader } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FaMoon, FaPlus, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import {
  useGetProductsQuery,
  useAddToCartMutation,
  useDeleteProductMutation,
} from "./api";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Logo from "./assets/logo.svg";
import { useNavigate } from "react-router";
import { useClickAway } from "ahooks";
import { SellMenu } from "./components/ui/SellMenu";
import { MassagesBox } from "./components/ui/MassagesBox";

export const Product = () => {
  const { data, isFetching } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteProduct] = useDeleteProductMutation();
  const [addToCart] = useAddToCartMutation();
  const sellMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const productId: number = Number(window.location.toString().split("/").pop());

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
  }

  const handleAddToCartButtonClicked = async (product: Product) => {
    try {
      await addToCart({
        title: product.title,
        image: product.image,
        price: product.price,
        description: product.description,
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
    <Flex width={"100%"} minHeight={"100%"}>
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
      <Flex
        wrap={"wrap"}
        width={"100%"}
        minHeight={"100%"}
        grow={1}
        p={4}
        gap={4}
        mt={"100px"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {isFetching ? (
          <Loader />
        ) : (
          data
            ?.filter((product) => product.id === productId)
            .map((product) => (
              <Flex
                p={2}
                borderRadius={"md"}
                backgroundColor={"#1E90FF"}
                grow={1}
                key={product.id}
                wrap={"wrap"}
                direction={"column"}
              >
                <Flex p={16} grow={1}>
                  <Image src={product.image} />
                  <Flex direction={"column"} gap={4} p={4}>
                    <Text fontSize={"32px"}>{product.title}</Text>
                    <Text fontSize={"24px"}>
                      {product.price}
                      {product.curr}
                    </Text>
                    <Text>{product.description}</Text>
                    {product.isDeletable === true ? (
                      <Button onClick={() => handleDeleteButton(product.id!)}>
                        Delete!
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAddToCartButtonClicked(product)}
                      >
                        Add to cart!
                      </Button>
                    )}
                  </Flex>
                </Flex>
                <MassagesBox msgs={product.msgs} />
              </Flex>
            ))
        )}
      </Flex>
    </Flex>
  );
};
