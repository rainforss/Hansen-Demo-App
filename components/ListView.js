import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { AddIcon, InfoIcon } from "@chakra-ui/icons";
import { Img } from "@chakra-ui/image";
import { Badge, Box, Divider, Flex, Text } from "@chakra-ui/layout";
import ProductDetail from "./ProductDetail";

const ListView = ({ product, isLoggedIn }) => {
  const controls = useDisclosure();
  return (
    <>
      <Flex
        direction="row"
        p={4}
        justifyContent="space-between"
        alignItems="center"
        w="90%"
        mx="auto"
        my={8}
        borderRadius={4}
        border="green"
        borderWidth={2}
      >
        <Img src="https://via.placeholder.com/200" justifySelf="start" />
        <Flex justifyContent="space-between" w="80%">
          <Box px={4}>
            <Badge variant="outline" fontSize="lg" colorScheme="green">
              {product.name}
            </Badge>
            <Divider my={4} />
            <Text as="p">{product.marketingTagLine}</Text>
            <Divider my={4} />
            <Flex justifyContent="space-between">
              <Text as="p">Initial payment: ${product.marketingPrice}</Text>
              <Text as="p">Recurring: ${product.marketingRecurringPrice}</Text>
            </Flex>
          </Box>
          <Flex direction="column" justifyContent="center">
            {isLoggedIn ? (
              <Button colorScheme="green" my={2} leftIcon={<AddIcon />}>
                ADD PRODUCT
              </Button>
            ) : null}
            <Button
              colorScheme="telegram"
              variant="outline"
              my={2}
              leftIcon={<InfoIcon />}
              onClick={controls.onOpen}
            >
              PRODUCT DETAILS
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Divider my={4} w="90%" mx="auto" borderColor="#e32525" />
      <ProductDetail controls={controls} product={product} />
    </>
  );
};

export default ListView;