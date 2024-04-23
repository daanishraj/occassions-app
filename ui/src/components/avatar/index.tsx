import { Avatar, Menu, rem } from "@mantine/core";
import { IconGift, IconUserCircle } from "@tabler/icons-react";
import styles from "./styles.module.css";

type TProps = {
  imageName?: string;
  userName?: string;
};
const UserAvatar = ({ imageName, userName }: TProps) => {
  const initials = userName
    ?.split(" ")
    .map((name) => name.charAt(0))
    .join("");

  if (!imageName) {
    console.log("i am here");

    return (
      <>
        <div className={styles.avatar}>
          <Menu width={200} shadow="md">
            <Menu.Target>
              <Avatar src={null} alt={userName || "no user name"} size="lg">
                {initials}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}
                component="a"
                href="/profile"
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconGift style={{ width: rem(14), height: rem(14) }} />}
                component="a"
                href="/occasions"
              >
                Occassions
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </>
    );
  }

  return <Avatar src={imageName} alt={userName || "no user name"} />;
};

export default UserAvatar;
