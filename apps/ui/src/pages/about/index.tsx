import { Button, Card, Container, Stack, Text, Title } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

const About = () => {
  const navigate = useNavigate();
  const card1Ref = useRef<HTMLDivElement>(null);
  const scrollIndicator1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const scrollIndicator2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["card1"]));
  const intersectionRatiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Enable scrolling on body and html when on About page
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    
    return () => {
      // Reset on unmount (optional)
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const sections = [
      { ref: card1Ref, id: "card1" },
      { ref: scrollIndicator1Ref, id: "indicator1" },
      { ref: card2Ref, id: "card2" },
      { ref: scrollIndicator2Ref, id: "indicator2" },
      { ref: card3Ref, id: "card3" },
    ];

    // Initialize card1 as visible
    intersectionRatiosRef.current.set("card1", 1.0);

    const observer = new IntersectionObserver(
      (entries) => {
        // Update intersection ratios
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section-id");
          if (sectionId) {
            intersectionRatiosRef.current.set(sectionId, entry.intersectionRatio);
          }
        });

        // Determine which sections should be visible
        // For cards, show ONLY the one with highest intersection ratio
        // For indicators, show if their corresponding card is visible
        const cardIds = ["card1", "card2", "card3"];
        const visibleCards = new Set<string>();
        const visibleIndicators = new Set<string>();

        // Find the card with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleCard = "card1"; // default to first card

        cardIds.forEach((cardId) => {
          const ratio = intersectionRatiosRef.current.get(cardId) || 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleCard = cardId;
          }
        });

        // Only show the most visible card (if it has at least 10% visibility)
        if (maxRatio > 0.1) {
          visibleCards.add(mostVisibleCard);
        } else {
          // Fallback: if no card is visible, keep the first one
          visibleCards.add("card1");
        }

        // Show indicators when their corresponding card is visible
        if (visibleCards.has("card1")) {
          visibleIndicators.add("indicator1");
        }
        if (visibleCards.has("card2")) {
          visibleIndicators.add("indicator2");
        }

        // Combine visible sections
        const newVisibleSections = new Set([...visibleCards, ...visibleIndicators]);
        setVisibleSections(newVisibleSections);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Multiple thresholds for smoother tracking
        rootMargin: "0px",
      }
    );

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute("data-section-id", id);
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className={styles.aboutPage}>
      <div className={styles.header}>
        <Title
          order={3}
          className={styles.logoTitle}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          NMAD
        </Title>
        <Button
          variant="filled"
          radius="md"
          onClick={() => navigate("/login")}
          className={styles.loginButton}
        >
          Login
        </Button>
      </div>
      <Container size="lg" className={styles.container}>
        <Stack gap="lg" className={styles.cardsStack}>
          {/* Card 1: Intro - Left aligned */}
          <div
            ref={card1Ref}
            className={visibleSections.has("card1") ? styles.fadeIn : styles.fadeOut}
          >
            <Card shadow="sm" radius="md" p="md" className={styles.cardLeft}>
              <Text size="xl" className={styles.icon}>🎂</Text>
              <Stack gap="lg" mt="sm">
                <Text size="md">
                  A birthday is a special day — a moment to pause and celebrate the simple joy of being.
                </Text>
                <Text size="md">
                  I've always loved wishing friends and family on their birthdays. Seeing them smile makes me happy too.
                </Text>
              </Stack>
            </Card>
          </div>

          {/* Scroll indicator */}
          <div
            ref={scrollIndicator1Ref}
            className={`${styles.scrollIndicator} ${styles.scrollIndicatorFirst} ${
              visibleSections.has("indicator1") ? styles.fadeIn : styles.fadeOut
            }`}
          >
            <IconChevronDown className={styles.chevron} />
          </div>

          {/* Card 2: Problem - Right aligned */}
          <div
            ref={card2Ref}
            className={visibleSections.has("card2") ? styles.fadeIn : styles.fadeOut}
          >
            <Card shadow="sm" radius="md" p="md" className={styles.cardRight}>
              <Text size="xl" className={styles.icon}>📅</Text>
              <Stack gap="lg" mt="sm">
                <Text size="md">
                  But I often forgot to send those wishes 😅.
                </Text>
                <Text size="md">
                  At first, I added birthdays to my Google Calendar. It worked — until my job ended and all my events vanished along with my work account. Moving them to my personal calendar just filled my phone with endless reminder notifications — more noise in an already busy life.
                </Text>
                <Text size="md">
                  I tried birthday reminder apps, but that only meant installing yet another app and getting even more notifications. More noise again. Finally, I started jotting birthdays in my diary. That felt peaceful… until I realized I had to rewrite every date each year. Surely there had to be a simpler, calmer way? 🤔
                </Text>
              </Stack>
            </Card>
          </div>

          {/* Scroll indicator */}
          <div
            ref={scrollIndicator2Ref}
            className={`${styles.scrollIndicator} ${
              visibleSections.has("indicator2") ? styles.fadeIn : styles.fadeOut
            }`}
          >
            <IconChevronDown className={styles.chevron} />
          </div>

          {/* Card 3: Solution - Left aligned */}
          <div
            ref={card3Ref}
            className={visibleSections.has("card3") ? styles.fadeIn : styles.fadeOut}
          >
            <Card shadow="sm" radius="md" p="md" className={styles.cardLeft}>
              <Text size="xl" className={styles.icon}>💌</Text>
              <Stack gap="lg" mt="sm">
                <div>
                  <Text size="md" component="span">Enter</Text>
                  <span style={{ marginLeft: '0.75rem' }} />
                  <Title order={3} component="span" className={styles.solutionTitle}>
                    <em>Never Miss a Date!</em>
                  </Title>
                </div>
                <Text size="md" className={styles.serifText}>
                  A small, thoughtful app that quietly remembers birthdays and anniversaries for you. On each special day, it simply sends you an SMS — a gentle reminder to reach out to the people who matter.
                </Text>
                <Text size="md" c="dimmed" fs="italic">
                  No calendars. No clutter. No missed birthdays. Just a little help to simplify life — and share your joy 😊
                </Text>
              </Stack>
            </Card>
          </div>
        </Stack>
      </Container>
    </div>
  );
};

export default About;

