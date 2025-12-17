import { Button, Flex, Loader, Text } from "@chakra-ui/react";
import { useGetProductsQuery, useLazyGetProductsQuery } from "./api";

export const TestApi = () => {
  const [getProducts, { isFetching: isFetchingLazy, data: dataLazy }] =
    useLazyGetProductsQuery();
  const { isFetching, data } = useGetProductsQuery();

  return (
    <Flex gap="50px" justifyContent="space-between">
      <Flex direction="column" border="1px solid blue">
        <Text fontSize="32px">With lazy</Text>
        {isFetchingLazy ? (
          <Loader />
        ) : (
          <>
            {" "}
            <Button
              onClick={() => {
                getProducts();
              }}
            >
              Get Products
            </Button>
            {dataLazy?.map((product) => (
              <Flex direction="column" border="1px solid red">
                <Text>{product.id}</Text>
                <Text>{product.title}</Text>
                <Text>{product.description}</Text>
                <Text>
                  {product.price}
                  {product.curr}
                </Text>
              </Flex>
            ))}
          </>
        )}
      </Flex>
      <Flex direction="column" border="1px solid blue">
        <Text fontSize="32px">Without lazy</Text>
        {isFetching ? (
          <Loader />
        ) : (
          data?.map((product) => (
            <Flex direction="column" border="1px solid red">
              <Text>{product.id}</Text>
              <Text>{product.title}</Text>
              <Text>{product.description}</Text>
              <Text>
                {product.price}
                {product.curr}
              </Text>
            </Flex>
          ))
        )}
      </Flex>
    </Flex>
  );
};
