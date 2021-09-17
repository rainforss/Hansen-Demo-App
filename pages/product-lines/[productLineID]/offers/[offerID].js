import Header from "../../../../components/Header";
import fetch from "../../../../utils/fetchJson";
import { HANSEN_CPQ_V2_BASE_URL } from "../../../../utils/constants";
import withSession from "../../../../middleware/session";
import { dbConnect } from "../../../../middleware/db";
import User from "../../../../models/user";
import ProductsDisplay from "../../../../components/ProductsDisplay";
import { useState } from "react";
import { Badge, Center, Flex, Heading } from "@chakra-ui/layout";
import Footer from "../../../../components/Footer";
import ViewControl from "../../../../components/ViewControl";
import CategorySelection from "../../../../components/CategorySelection";
import QuoteCart from "../../../../components/QuoteCart";
import useQuote from "../../../../hooks/useQuote";
import { useToast } from "@chakra-ui/toast";
import fetcher from "../../../../utils/nodeFetchJson";
import Error from "next/error";
import ErrorToast from "../../../../components/ErrorToast";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { useRouter } from "next/router";

export default function offerID({
  username,
  products,
  quoteId,
  status,
  errorMessage,
  productLine,
  offer,
  customerType,
}) {
  if (status) {
    return (
      <>
        <Header username={username} />
        <Center height="70vh" overflow="hidden">
          <Error statusCode={status} title={errorMessage} />
        </Center>
        <QuoteCart quoteId={quoteId} />
        <Footer />
      </>
    );
  }
  const isLoggedIn = !!username;
  const toast = useToast();
  const [viewMode, setViewMode] = useState("cardview");
  const router = useRouter();
  const { productLineID, offerID } = router.query;
  if (!quoteId) {
    return (
      <>
        <Header username={username} />
        <CategorySelection
          categories={productLine.children}
          urlPrefix={`/product-lines/${productLineID}/offers`}
        />
        {customerType !== "Residential" && (
          <Alert status="warning" w="80%" mx="auto" mt={8}>
            <AlertIcon />
            You must be a residential type customer to purchase these products.
          </Alert>
        )}
        <Flex justifyContent="space-between" w="80%" mx="auto" mt={8}>
          <Flex justifyContent="center" alignItems="center">
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              color="#b39573"
              mx={2}
            >
              {offer.name}
            </Heading>
            {products && (
              <Badge color="white" bg="gray.500" fontSize="xl" mx={2}>
                &nbsp; {products.entities.length} &nbsp;
              </Badge>
            )}
          </Flex>
          <ViewControl viewMode={viewMode} setViewMode={setViewMode} />
        </Flex>
        {products ? (
          <ProductsDisplay
            products={products.entities}
            viewMode={viewMode}
            isLoggedIn={isLoggedIn}
            allowAdd={customerType === "Residential"}
          />
        ) : (
          <Alert status="warning" w="80%" mx="auto" mt={8}>
            <AlertIcon />
            We are not offer any products for this category at the moment.
          </Alert>
        )}
        <QuoteCart quoteId={quoteId} />
        <Footer />
      </>
    );
  }
  const { quote, mutateQuote } = useQuote(quoteId);
  const [adding, setAdding] = useState(false);
  const addToCart = async (productId) => {
    try {
      mutateQuote(
        {
          ...quote,
          items: [...quote.items, { productId, itemNumber: Math.random() }],
        },
        false
      );
      setAdding(true);
      await fetch(`${HANSEN_CPQ_V2_BASE_URL}/quotes/${quoteId}/items`, {
        method: "POST",
        body: JSON.stringify({
          productId,
          linkedItemId: "",
          itemAction: "add",
        }),
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      mutateQuote();
      toast({
        title: "Item added.",
        description:
          "The item has been added to cart successfully, please configure before checking out.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setAdding(false);
    } catch (error) {
      toast({
        render: ({ id, onClose }) => (
          <ErrorToast error={error} onClose={onClose} />
        ),
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      mutateQuote(
        {
          ...quote,
          items: quote.items.filter((i) => i.productId !== productId),
        },
        false
      );
      setAdding(false);
    }
  };
  return (
    <>
      <Header username={username} />
      <CategorySelection
        type={productLine.name}
        categories={productLine.children}
      />
      {customerType !== "Residential" && (
        <Alert status="warning" w="80%" mx="auto" mt={8}>
          <AlertIcon />
          You must be a residential type customer to purchase these products.
        </Alert>
      )}
      <Flex justifyContent="space-between" w="80%" mx="auto" mt={8}>
        <Flex justifyContent="center" alignItems="center">
          <Heading as="h2" size="xl" textAlign="center" color="#b39573" mx={2}>
            {offer.name}
          </Heading>
          {products && (
            <Badge color="white" bg="gray.500" fontSize="xl" mx={2}>
              &nbsp; {products.entities.length} &nbsp;
            </Badge>
          )}
        </Flex>
        <ViewControl viewMode={viewMode} setViewMode={setViewMode} />
      </Flex>
      {products ? (
        <ProductsDisplay
          products={products.entities}
          viewMode={viewMode}
          isLoggedIn={isLoggedIn}
          addToCart={addToCart}
          allowAdd={customerType === "Residential"}
        />
      ) : (
        <Alert status="warning" w="80%" mx="auto" mt={8}>
          <AlertIcon />
          We are not offer any products for this category at the moment.
        </Alert>
      )}
      <QuoteCart quoteId={quoteId} adding={adding} />
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, params }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  try {
    const classificationresult = await fetcher(
      `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
    );
    const productLine = classificationresult.find(
      (r) => r.name === params.productLineID.replace(/-/g, " ")
    );

    const offer = productLine.children.find(
      (p) => p.name === params.offerID.replace(/-/g, " ")
    );
    const endPoint = `${HANSEN_CPQ_V2_BASE_URL}/offers?InstanceTypeNames=Package,Promotion,Bundle&Classifications=[Sales_Category;${offer.guid};false]&ClassificationElementName=Sales_Category&xsltCode=offer_special&at[p1]=ID&el[p2]=Name&at[p3]=BusinessID&el[p4]=Description&el[p5]=Element_Guid&el[p6]=Description`;
    const result = await fetcher(endPoint);
    const products = result[0] || null;
    if (!user) {
      return {
        props: { products, productLine, offer },
      };
    }
    const quoteId = req.session.get("quoteId");

    return {
      props: {
        products,
        username: user.firstName,
        quoteId,
        productLine,
        offer,
        customerType: user.customerType,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        status: error.response.status,
        errorMessage: error.data.responseText,
        username: user.firstName,
        quoteId,
      },
    };
  }
});
