import { currs } from "@/zustand_store";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { RadioCard } from "./RadioCard";
import axios from "axios";

interface Props  {
  innerRef?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
};

export const SellMenu = ({innerRef, children}: Props) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState(currs[0]);

  const handleSellButtonClicked = async () => {
    if (
      imgInputRef.current &&
      descriptionInputRef.current &&
      titleInputRef.current &&
      priceInputRef.current &&
      selected
    ) {
      const file = imgInputRef.current.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("title", titleInputRef.current.value);
        formData.append("price", priceInputRef.current.value);
        formData.append("description", descriptionInputRef.current.value);
        formData.append("image", file);
        formData.append("isDeletable", "true");
        formData.append("curr", selected);
        try {
          await axios.post("http://localhost:3001/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (err) {
          console.error("Add product error:", err);
        }
      }
    }
  };

  return (
    <Flex p={4} gap={4} flexDirection={"column"} display={"none"} ref={innerRef}>
      <Flex gap={2} flexDirection={"column"}>
        <Text>Tittle :</Text>
        <Input
          placeholder="Please write a tittle..."
          ref={titleInputRef}
        ></Input>
      </Flex>
      <Flex gap={2} flexDirection={"column"}>
        <Text>Add a image :</Text>
        <Input type="file" p={2} ref={imgInputRef}></Input>
      </Flex>
      <Flex gap={2} flexDirection={"column"}>
        <Text>Add a Price :</Text>
        <Input
          p={2}
          ref={priceInputRef}
          placeholder="Please add a price..."
          type="number"
        ></Input>
      </Flex>
      <Flex gap={2} flexDirection={"column"}>
        <Text>Add a Currency :</Text>
        <Flex gap={4} p={2} maxW={"100vw"} overflowX={"auto"}>
          {currs.map((c, i) => (
            <RadioCard
              key={i}
              value={c}
              isChecked={selected === c}
              onChange={setSelected}
            >
              {c}
            </RadioCard>
          ))}
        </Flex>
      </Flex>
      <Flex gap={2} flexDirection={"column"}>
        <Text>Please write a description :</Text>
        <Input
          placeholder="Please write a description..."
          ref={descriptionInputRef}
        ></Input>
      </Flex>
      <Flex p={2}>
        <Button onClick={handleSellButtonClicked}>Sell!</Button>
          </Flex>
          {children}
    </Flex>
  );
};
