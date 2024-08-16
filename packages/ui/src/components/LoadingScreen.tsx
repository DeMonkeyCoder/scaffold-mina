import GradientBG from "@/components/GradientBG";
import styles from "@/styles/Home.module.css";

export default function LoadingScreen() {
  return (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
          <span className={styles.loadingText}>Loading</span>
          <img className="w-12" src="/assets/qubeanimation.gif" />
        </div>
      </div>
    </GradientBG>
  );
}
