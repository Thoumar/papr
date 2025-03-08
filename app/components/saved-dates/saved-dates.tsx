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

  // Sort the favorites array *before* mapping.  This is the key change.
  const sortedFavorites = [...favorites].sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className={styles.savedDates}>
      {sortedFavorites.map(
        (
          date // Use sortedFavorites here
        ) => (
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
        )
      )}
    </div>
  );
};
