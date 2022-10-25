import { ApolloProvider } from "@apollo/client";
import "@fontsource/lobster";
import {
  ActionIcon,
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  Header,
  MantineProvider,
  Title,
} from "@mantine/core";
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { IconMoon, IconSunHigh } from "@tabler/icons";
import { getCookie, setCookie } from "cookies-next";
import { EmojiStyle } from "emoji-picker-react";
import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useApollo } from "../src/apollo-client";

const description = "Jamboree is the next-gen party planning app with a smooth and simple UX.";
const image = "/public/emojis/1f389.png";
const imageAlt = description;

const Emoji = dynamic(
  () => import("emoji-picker-react").then((mod) => mod.Emoji),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  const preferredColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <>
      <Head>
        <title>Jamboree</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta property="og:site_name" content="Jamboree" />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="twitter:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content={imageAlt} />
        <meta property="twitter:image" content={image} />
        <meta property="twitter:image:alt" content={imageAlt} />
        <meta name="keywords" content="Jamboree,Party,GraphQL" />
        <meta name="author" content="RaviAnand Mohabir" />
      </Head>

      <ApolloProvider client={apolloClient}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
            }}
          >
            <AppShell
              padding="md"
              header={
                <Header
                  height={70}
                  p="md"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Link href="/">
                    <Group>
                      <Title
                        sx={{
                          fontFamily: "Lobster",
                          ":hover": { cursor: "pointer" },
                        }}
                      >
                        Jamboree
                      </Title>
                      <Emoji unified="1f389" emojiStyle={EmojiStyle.TWITTER} />
                    </Group>
                  </Link>
                  <ActionIcon onClick={() => toggleColorScheme()}>
                    {colorScheme === "dark" ? <IconSunHigh /> : <IconMoon />}
                  </ActionIcon>
                </Header>
              }
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              })}
            >
              <Component {...pageProps} />
            </AppShell>
          </MantineProvider>
        </ColorSchemeProvider>
      </ApolloProvider>
    </>
  );
}

export const getServerSideProps = ({
  ctx,
}: {
  ctx: GetServerSidePropsContext;
}) => ({
  // get color scheme from cookie
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});

export default MyApp;
