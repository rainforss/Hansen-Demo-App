import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Icon from "@chakra-ui/icon";
import {
  FaFacebookSquare,
  FaGooglePlusSquare,
  FaInstagramSquare,
  FaTwitterSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { getWebPageByWebsiteIdAndPageName } from "../utils/contentful";
import { DARK_GOLD } from "../utils/constants";

export default function contactPage({
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  username,
}) {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 51.0565696,
    lng: -114.0193534,
  };

  return (
    <>
      <Header
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav}
        username={username}
      />
      <Flex
        w={{ base: "90%", md: "80%" }}
        mx="auto"
        justify="center"
        direction={{ base: "column", md: "row" }}
        py={24}
      >
        <Flex
          direction="column"
          align="flex-start"
          justify="space-between"
          w={{ base: "100%", md: "30%" }}
        >
          <Heading as="h2" mb={6}>
            Contact Us
          </Heading>
          <Box color={DARK_GOLD}>
            <Text my={2} fontWeight="bold">
              Email: contact@evolution.com
            </Text>
            <Text my={2} fontWeight="bold">
              Phone: 1800-800-8001
            </Text>
          </Box>
          <Stack direction="row" spacing={3}>
            <Icon
              color="grey"
              _hover={{ color: "#3b5998", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaFacebookSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#1DA1F2", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaTwitterSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#DB4A39", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaGooglePlusSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#C13584", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaInstagramSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#FF0000", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaYoutubeSquare}
            />
          </Stack>
        </Flex>
        <Box w={{ base: "100%", md: "50%" }}>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </Box>
      </Flex>
      <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;

  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getWebPageByWebsiteIdAndPageName(process.env.CONTENTFUL_WEBSITE_ID);

  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const productLinesRes = await fetch(
    `${process.env.HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }

  if (!user) {
    return {
      props: {
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        productLines,
      },
    };
  }

  if (!quoteId) {
    return {
      props: {
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        productLines,
        username: user.firstName,
      },
    };
  }

  return {
    props: {
      headerNav,
      footerNav,
      headerLogo,
      footerLogo,
      productLines,
      username: user.firstName,
      quoteId,
    },
  };
});
