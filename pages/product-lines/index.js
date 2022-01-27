import Header from "../../components/Header";
import fetch from "node-fetch";
import {
  BUSINESS_SUB_CATEGORIES,
  DARK_GOLD,
  HANSEN_CPQ_V2_BASE_URL,
  MOBILE_PRODUCTS_ENDPOINT,
  RESIDENTIAL_SUB_CATEGORIES,
} from "../../utils/constants";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import User from "../../models/user";

import Hero from "../../components/Hero";
import CategorySelection from "../../components/CategorySelection";
import Footer from "../../components/Footer";
import { Center, Heading, Box } from "@chakra-ui/layout";
import QuoteCart from "../../components/QuoteCart";
import fetcher from "../../utils/nodeFetchJson";
import Error from "next/error";
import { useRouter } from "next/router";
import {
  getHeaderAndFooterNavigationOfWebsite,
  getPageSectionsOfWebPage,
} from "../../utils/contentful";

export default function productLines({
  username,
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  quoteId,
}) {
  // if (status) {
  //   return (
  //     <>
  //       <Header username={username} />
  //       <Center height="70vh" overflow="hidden">
  //         <Error statusCode={status} title={errorMessage} />
  //       </Center>
  //       <QuoteCart quoteId={quoteId} />
  //       <Footer />
  //     </>
  //   );
  // }

  return (
    <>
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav.items[0]}
      />
      <Box py={24}>
        <Heading as="h2" size="lg" textAlign="center" textTransform="uppercase">
          Our product lines
        </Heading>
        <CategorySelection
          categories={productLines}
          urlPrefix="/product-lines"
        />
        {username ? <QuoteCart quoteId={quoteId} /> : null}
      </Box>
      <Footer
        logoURL={footerLogo.fields.file.url}
        footerNav={footerNav.items[0]}
      />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;
  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getHeaderAndFooterNavigationOfWebsite(
      process.env.CONTENTFUL_WEBSITE_ID
    );
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const productLinesRes = await fetch(
    `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
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
