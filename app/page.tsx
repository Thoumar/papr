"use client";

import styles from "./page.module.sass";

import { BrainDump } from "./components/brain-dump/brain-dump";
import { TopPriorities } from "./components/top-priorities/top-priorities";
import { DailySchedule } from "./components/daily-schedule/daily-schedule";
import Header from "./components/header/header"; // In your page.tsx file where the store is defined

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <div className={styles.left}>
          <TopPriorities />{" "}
          {/* Pass the store and currentDate to TopPriorities */}
          <BrainDump /> {/* Pass the store and currentDate to BrainDump */}
        </div>
        <div className={styles.right}>
          <DailySchedule />{" "}
          {/* Pass the store and currentDate to DailySchedule */}
        </div>
      </main>
    </div>
  );
}
