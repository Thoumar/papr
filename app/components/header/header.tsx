"use client";

import { useState, useEffect } from "react";

import { useAppStore } from "@papr/app/stores/appStore";

import {
  ClearRounded,
  ArrowLeftRounded,
  ArrowRightRounded,
  StarBorderRounded,
  CalendarTodayRounded,
} from "@mui/icons-material";

import styles from "./header.module.sass";

export const Header = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const setCurrentDate = useAppStore((state) => state.setCurrentDate);
  const clearDay = useAppStore((state) => state.clearDay);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onClear() {
    const confirmed = confirm(
      "You are about to reset all the cells and events of the current day, continue?"
    );
    if (confirmed) clearDay(new Date(currentDateString));
  }

  function getFormattedDate() {
    if (!currentDateString) return "";
    try {
      const dateObj = new Date(currentDateString);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date string:", currentDateString);
        return "Invalid Date";
      }

      return isMobile
        ? dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            weekday: "short",
          })
        : dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            weekday: "long",
            year: "numeric",
          });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  }

  const clickNextDay = () => {
    setCurrentDate((prevDate) => {
      const nextDate = new Date(prevDate);
      nextDate.setDate(prevDate.getDate() + 1);
      return nextDate;
    });
  };

  const clickPreviousDay = () => {
    setCurrentDate((prevDate) => {
      const prevDay = new Date(prevDate);
      prevDay.setDate(prevDate.getDate() - 1);
      return prevDay;
    });
  };

  const goToToday = () => setCurrentDate(new Date());

  const addCurrentDateToFavorite = () => addFavorite(currentDateString);

  return (
    <header className={styles.header}>
      <span className={styles.title}>Papr</span>
      <span className={styles.date}>{getFormattedDate()}</span>
      <span className={styles.buttons}>
        <button onClick={addCurrentDateToFavorite}>
          <StarBorderRounded fontSize="small" />
        </button>
        <button onClick={goToToday}>
          <CalendarTodayRounded fontSize="small" />
        </button>
        <button onClick={clickPreviousDay}>
          <ArrowLeftRounded fontSize="small" />
        </button>
        <button onClick={clickNextDay}>
          <ArrowRightRounded fontSize="small" />
        </button>
        <button onClick={onClear}>
          <ClearRounded fontSize="small" />
        </button>
      </span>
    </header>
  );
};
