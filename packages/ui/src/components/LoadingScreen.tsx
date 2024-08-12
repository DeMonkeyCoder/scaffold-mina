
import GradientBG from "@/components/GradientBG";
import styles from "@/styles/Home.module.css";
import { PacmanLoader } from "react-spinners";

export default function LoadingScreen() {
  return (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
            <span className={styles.loadingText}>Loading Screen<PacmanLoader /></span>      
        </div>
      </div>
    </GradientBG>
  );
}