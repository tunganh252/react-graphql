import { Box, Flex, Heading, Link } from "@chakra-ui/layout";
import NextLink from "next/link";

const Navbar = ({}) => {
  return (
    <div>
      <Box bg="tan" p={4}>
        <Flex maxW={800} justifyContent="space-between" m="auto" align="center">
          <NextLink href="/">
            <Heading>FsNta</Heading>
          </NextLink>
          <Box>
            <NextLink href="/login">
              <Link mr={2}>Login</Link>
            </NextLink>
            <NextLink href="/login">
              <Link mr={2}>Register</Link>
            </NextLink>
            <NextLink href="/login">
              <Link mr={2}>Logout</Link>
            </NextLink>
          </Box>
        </Flex>
      </Box>
    </div>
  );
};
export default Navbar;
