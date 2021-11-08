import { useMeQuery } from "@/generated/graphql";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export const useCheckAuth = () => {
  const router = useRouter();

  const { data, loading } = useMeQuery();
  useEffect(() => {
    if (
      !loading &&
      data?.me &&
      (router.route === "/login" || router.route === "/register")
    ) {
      router.replace("/");
    }
  }, [data, loading, router]);

  return { data, loading };
};
