import Navbar from "@/components/Navbar";
import { useGetPostsQuery } from "@/generated/graphql";
import { GetPostsDocument } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "src/lib/apolloClient";

const Index = () => {
  const { data, loading } = useGetPostsQuery();
  console.log(data);

  return (
    <>
      <Navbar />
      {loading ? (
        "Loading..."
      ) : (
        <ul>
          {data?.getPosts?.map((x, i) => {
            return <li key={i}>{x.title}</li>;
          })}
        </ul>
      )}
    </>
  );
};

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
