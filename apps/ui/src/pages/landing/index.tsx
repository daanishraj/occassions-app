import { SignedOut } from "@clerk/clerk-react";
import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <SignedOut>
      <div className={styles.landingPage}>
        <div className={styles.header}>
          <Button
            variant="filled"
            radius="md"
            onClick={() => navigate("/login")}
            className={styles.loginButton}
          >
            Login
          </Button>
        </div>
        <Container size="lg" className={styles.hero}>
          <div className={styles.heroContent}>
            <Stack gap="sm" align="center" className={styles.heroText}>
              <Title order={1} className={styles.title}>
                Never Miss a Date!
              </Title>
              <Text
                size="xl"
                c="dimmed"
                ta="center"
                fs="italic"
              >
                Delight your loved ones & please yourself 🙃
              </Text>
            </Stack>
            <div className={styles.heroImage}>
              <img
                src="/images/bday_image.jpg"
                alt="Two heart-shaped balloons floating over a present"
                className={styles.image}
              />
            </div>
          </div>
        </Container>
      </div>
    </SignedOut>
  );
};

export default Landing;

