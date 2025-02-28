import {
  ArrowLeftRounded,
  ArrowRightRounded,
  RestartAltRounded,
} from "@mui/icons-material";

import styles from "./header.module.sass";

type HeaderProps = {
  date: Date;
  clickNextDay: () => void;
  clickPreviousDay: () => void;
};

const Header = ({ date, clickNextDay, clickPreviousDay }: HeaderProps) => {
  function onClear() {
    const confirmed = confirm(
      "You are about to reset all the cells and events of the current page, continue ?"
    );
    if (confirmed) {
      localStorage.removeItem("brain-dump-items");
      localStorage.removeItem("top-priorities-items");
    }
  }

  function getFormattedDate() {
    return date
      .toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(",", "");
  }

  return (
    <header className={styles.header}>
      <span className={styles.title}>Papr</span>
      <span className={styles.date}>{getFormattedDate()}</span>
      <span className={styles.buttons}>
        <button onClick={clickPreviousDay}>
          <ArrowLeftRounded fontSize="small" />
        </button>
        <button onClick={clickNextDay}>
          <ArrowRightRounded fontSize="small" />
        </button>
        <button onClick={onClear}>
          <RestartAltRounded fontSize="small" />
        </button>
      </span>
    </header>
  );
};

export default Header;
