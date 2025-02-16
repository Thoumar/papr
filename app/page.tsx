import styles from "./page.module.sass";

import { BrainDump } from "./components/brain-dump/brain-dump";
import { TopPriorities } from "./components/top-priorities/top-priorities";
import { DailySchedule } from "./components/daily-schedule/daily-schedule";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.left}>
          <TopPriorities />
          <BrainDump />
        </div>
        <div className={styles.right}>
          <DailySchedule />
        </div>
      </main>
    </div>
  );
}
