import { useMeQuery } from "@/generated/graphql";
import { useMutation } from "@apollo/client";
import { Box, Flex, Heading, Link } from "@chakra-ui/layout";
import NextLink from "next/link";

const Navbar = ({}) => {
  const { data, loading, error } = useMeQuery();

  let body;

  if (loading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/login">
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Logout</Link>
        </NextLink>
      </>
    );
  }

  return (
    <div>
      <Box bg="tan" p={4}>
        <Flex maxW={800} justifyContent="space-between" m="auto" align="center">
          <NextLink href="/">
            <Heading>FsNta</Heading>
          </NextLink>
          <Box>{body}</Box>
        </Flex>
      </Box>
    </div>
  );
};
export default Navbar;
