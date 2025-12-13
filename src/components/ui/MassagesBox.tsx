import {
  type Msg,
  useGetProfileQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/api";
import { Button, Flex, Input, Slider, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaStar, FaStarHalf } from "react-icons/fa6";

export const MassagesBox = ({ msgs }: { msgs: Msg[] }) => {
  const { data: userData } = useGetProfileQuery();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: products } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const msgInputRef = useRef<HTMLInputElement>(null);
  const productId: number =
    Number(window.location.toString().split("/").pop()) - 1;
  const [stars, setStars] = useState<number>(0);
  const [starsArray, setStarsArray] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    const newStarsArray = [0, 0, 0, 0, 0];
    for (let i = 0; i < Math.floor(stars); i++) {
      newStarsArray[i] = 1;
    }
    if (stars % 1 !== 0) {
      newStarsArray[Math.floor(stars)] = stars % 1;
    }
    setStarsArray(newStarsArray);
  }, [stars]);

  const handleSend = async () => {
    if (!userData || !products || !products[productId]) return;

    const createdMsg: Msg = {
      first_name: userData.user.first_name,
      last_name: userData.user.last_name || "",
      email: userData.user.email || "",
      description: msgInputRef.current?.value || "",
      companyName: userData.user.companyName || "",
      stars: starsArray,
    };

    const formData = new FormData();

    const updatedMsgs = [...products[productId].msgs, createdMsg];

    formData.append("title", products[productId].title);
    formData.append("price", String(products[productId].price));
    formData.append("description", products[productId].description || "");
    formData.append("curr", products[productId].curr);
    formData.append("isDeletable", String(products[productId].isDeletable));
    formData.append("msgs", JSON.stringify(updatedMsgs));

    await updateProduct({
      id: products[productId].id!,
      data: formData,
    }).unwrap();

    msgInputRef.current!.value = "";
    setStars(0);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <Flex direction={"column"} bgColor={"#ffffff33"} gap={4} p={4}>
      <Flex>
        <Flex direction={"column"}>
          <Slider.Root
            width="100px"
            defaultValue={[0]}
            value={[stars * 20]}
            onValueChange={(e) => setStars(e.value[0] / 20)}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Flex>
            {starsArray.map((s, i) =>
              Number(s) === 1 ? (
                <FaStar color="#dddd66" key={i} />
              ) : Number(s) > 0 && Number(s) < 1 ? (
                <FaStarHalf color="#dddd66" key={i} />
              ) : (
                <FaStar key={i} />
              )
            )}
          </Flex>
        </Flex>
        <Input
          ref={msgInputRef}
          type={"text"}
          placeholder={"Write a massage..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>Send</Button>
      </Flex>
      <Flex direction={"column-reverse"} ref={bottomRef}>
        {msgs.map((m, i) => (
          <Flex
            key={i}
            bgColor={"#ffffff33"}
            direction={"column"}
            gap={4}
            p={2}
          >
            <Flex bgColor={"#ffffff33"} direction={"column"} p={2}>
              <Flex gap={1}>
                <FaUserCircle />
                <Text>
                  {m.first_name} {m.last_name}
                </Text>
                <Text>from</Text>
                <Text>{m.companyName}</Text>
              </Flex>
              <Text fontSize={"sm"}>{m.email}</Text>
            </Flex>
            <Flex>
              {m.stars.map((s, i) =>
                Number(s) === 1 ? (
                  <FaStar color="#dddd66" key={i} />
                ) : Number(s) > 0 && Number(s) < 1 ? (
                  <FaStarHalf color="#dddd66" key={i} />
                ) : (
                  <FaStar key={i} />
                )
              )}
            </Flex>
            <Flex>
              <Text>{m.description}</Text>
            </Flex>
            <hr />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
