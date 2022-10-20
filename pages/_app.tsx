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
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
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
      </Head>

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
    </>
  );
}

MyApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // get color scheme from cookie
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});

export default MyApp;
