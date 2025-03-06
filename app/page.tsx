"use client";
import { Header } from "@papr/app/components/header/header";
import { BrainDump } from "@papr/app/components/brain-dump/brain-dump";
import { SavedDates } from "@papr/app/components/saved-dates/saved-dates";
import { DailySchedule } from "@papr/app/components/daily-schedule/daily-schedule";
import { TopPriorities } from "@papr/app/components/top-priorities/top-priorities";

import styles from "./page.module.sass";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.sidebarLeft}>
        <SavedDates />
      </div>
      <main className={styles.main}>
        <Header />
        <div className={styles.left}>
          <TopPriorities /> <BrainDump />
        </div>
        <div className={styles.right}>
          <DailySchedule />
        </div>
      </main>
      <div className={styles.sidebarRight}></div>
    </div>
  );
}
