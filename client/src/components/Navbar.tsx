import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from "@/generated/graphql";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, Link } from "@chakra-ui/layout";
import NextLink from "next/link";

const Navbar = ({}) => {
  const { data, loading: useMeLoading, error: _error } = useMeQuery();
  const [logout, { loading: useLogoutLoading }] = useLogoutMutation();
  let body;

  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: null,
            },
          });
        }
      },
    });
  };

  if (useMeLoading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <Flex>
        <NextLink href="/login">
          <Link mr={1}>Login</Link>
        </NextLink>
        <p>/</p>
        <NextLink href="/register">
          <Link ml={1}>Register</Link>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Button onClick={logoutUser} isLoading={useLogoutLoading}>
        Logout
      </Button>
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
