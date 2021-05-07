import Hero from "../components/Hero";
import Header from "../components/Header";
import { getHomePageImageSections } from "../utils/contentful";
import Footer from "../components/Footer";
import { dbConnect } from "../middleware/db";
import withSession from "../middleware/session";
import User from "../models/user";

export default function Home({ homePageEntry, username }) {
  const {
    firstSection,
    secondSection,
    thirdSection,
    fourthSection,
  } = homePageEntry.fields;
  const homePageImageSections = [
    { imageURL: firstSection.fields.file.url, alt: firstSection.fields.title },
    {
      imageURL: secondSection.fields.file.url,
      alt: secondSection.fields.title,
    },
    { imageURL: thirdSection.fields.file.url, alt: thirdSection.fields.title },
    {
      imageURL: fourthSection.fields.file.url,
      alt: fourthSection.fields.title,
    },
  ];
  return (
    <>
      <Header username={username} />
      <Hero homePageImageSections={homePageImageSections} />
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const homePageEntry = await getHomePageImageSections();
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  if (!user) {
    return {
      props: { homePageEntry },
    };
    // return {
    //   redirect: {
    //     destination: "/login",
    //     permanent: false,
    //   },
    // };
  }

  return {
    props: {
      homePageEntry,
      username: user.firstName,
    },
  };
});
