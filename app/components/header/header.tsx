import {
  ArrowLeftRounded,
  ArrowRightRounded,
  ClearRounded,
  CalendarTodayRounded,
} from "@mui/icons-material";

import styles from "./header.module.sass";
import { useAppStore } from "@/app/stores/appStore";

const Header = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const setCurrentDate = useAppStore((state) => state.setCurrentDate);
  const clearDay = useAppStore((state) => state.clearDay);

  function onClear() {
    const confirmed = confirm(
      "You are about to reset all the cells and events of the current page, continue ?"
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

      return dateObj
        .toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .replace(",", "");
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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <header className={styles.header}>
      <span className={styles.title}>Papr</span>
      <span className={styles.date}>{getFormattedDate()}</span>
      <span className={styles.buttons}>
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

export default Header;
