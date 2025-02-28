"use client";

import styles from "./page.module.sass";

import { BrainDump } from "./components/brain-dump/brain-dump";
import { TopPriorities } from "./components/top-priorities/top-priorities";
import { DailySchedule } from "./components/daily-schedule/daily-schedule";
import Header from "./components/header/header";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    console.log("Current Date: ", currentDate);
  }, [currentDate]);

  const onNextDay = () => {
    setCurrentDate((prevDate) => {
      const nextDate = new Date(prevDate);
      nextDate.setDate(prevDate.getDate() + 1);
      return nextDate;
    });
  };

  const onPreviousDay = () => {
    setCurrentDate((prevDate) => {
      const prevDay = new Date(prevDate);
      prevDay.setDate(prevDate.getDate() - 1);
      return prevDay;
    });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header
          date={currentDate}
          clickNextDay={onNextDay}
          clickPreviousDay={onPreviousDay}
        />
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
