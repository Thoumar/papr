"use client";

import { useAppStore } from "@papr/app/stores/appStore";

import { ClearRounded } from "@mui/icons-material";

import styles from "./saved-dates.module.sass";

export const SavedDates = () => {
  const { favorites, removeFavorite, setCurrentDate } = useAppStore();

  function getFormattedDate(dateString: string) {
    if (!dateString) return "";
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date string:", dateString);
        return "Invalid Date";
      }

      return dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "2-digit",
        weekday: "short",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  }

  return (
    <div className={styles.savedDates}>
      {favorites.map((date) => (
        <div key={date} className={styles.dateContainer}>
          <button
            className={styles.date}
            onClick={() => {
              setCurrentDate(new Date(date));
            }}
          >
            {getFormattedDate(date)}
          </button>

          <button
            className={styles.closeBtn}
            onClick={(e) => {
              e.preventDefault();
              removeFavorite(date);
            }}
          >
            <ClearRounded fontSize="small" />
          </button>
        </div>
      ))}
    </div>
  );
};
