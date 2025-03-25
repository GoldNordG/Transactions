import { getSession } from "next-auth/react";

export async function getServerSession(context) {
  const session = await getSession(context);

  console.log("Session dans getServerSession :", session);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
