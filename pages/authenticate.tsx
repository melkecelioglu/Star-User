import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import React from 'react';
import { AbiDecodingDataSizeInvalidError } from 'viem';

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  const address = token?.sub ?? null;
  console.log(address);
  // if we have a value for "address" here, our
  // server knows the user is authenticated.
  // so that we can then pass any data we want
  // to the page component here.

  return {
    props: {
      address,
      session,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({
  address,
}: AuthenticatedPageProps) => {
  return address ? (
    <h1>Authenticated as {address}</h1>
  ) : (
    <h1>Unauthenticated</h1>
  );
};

export default AuthenticatedPage;
