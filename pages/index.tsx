import type { NextPage } from "next";
import { Box, Button, Container, Input, Title, Stack } from "@mantine/core";
import { IconArrowBigRightLine, IconAt, IconHash } from "@tabler/icons";

const Home: NextPage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 64,
      }}
    >
      <Box sx={{ height: 64 }} />
      <Title
        sx={{ fontFamily: "Lobster", fontSize: "4rem", textAlign: "center" }}
      >
        Plan your own Party Right
      </Title>
      <Button
        sx={{ margin: "0 auto" }}
        rightIcon={<IconArrowBigRightLine />}
        variant="filled"
        color="pink"
        radius="lg"
        size="md"
      >
        Plan Now
      </Button>
      <Stack>
        <Title>Have a Party Code?</Title>
        <Input icon={<IconHash />} placeholder="your-party-code" size="md" />
      </Stack>
    </Container>
  );
};

export default Home;
