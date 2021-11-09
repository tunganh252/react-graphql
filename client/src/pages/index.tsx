import Navbar from "@/components/Navbar";
import { GetPostsDocument } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "src/lib/apolloClient";

const Index = () => (
  <>
    <Navbar />
    <h1>Hello World</h1>
  </>
);

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: GetPostsDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Index;
