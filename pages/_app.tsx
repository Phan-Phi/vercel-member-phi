import Head from "next/head";
import { type AppProps } from "next/app";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import createEmotionCache from "libs/createEmotionCache";
import { CacheProvider, type EmotionCache } from "@emotion/react";

import Layout from "layout/Layout";

import SWR from "context/SWR";
import Theme from "context/Theme";
import Choice from "context/Choice";
import Setting from "context/Setting";
import Routing from "context/Routing";
import SnackBar from "context/Snackbar";
import Permission from "context/Permission";
import Confirmation from "context/Confirmation";
import ErrorBoundary from "context/ErrorBoundary";

const clientSideEmotionCache = createEmotionCache();

interface PageProps {
  session: Session;
  [key: string]: any;
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: PageProps;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const { session, ...restPageProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Theme>
          <SnackBar>
            <ErrorBoundary>
              <SWR>
                <Setting>
                  <Choice>
                    <Confirmation>
                      <Permission>
                        <Routing>
                          <Layout>
                            <Component {...restPageProps} />
                          </Layout>
                        </Routing>
                      </Permission>
                    </Confirmation>
                  </Choice>
                </Setting>
              </SWR>
            </ErrorBoundary>
          </SnackBar>
        </Theme>
      </CacheProvider>
    </SessionProvider>
  );
}

export default MyApp;
