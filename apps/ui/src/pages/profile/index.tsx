import UserInfo from "./components/clerk-user-info";
import styles from './styles.module.css';


const Profile = () => {
  return (
  <div className={styles.avatar}>
    <UserInfo />
  </div>
  )
};

export default Profile;
