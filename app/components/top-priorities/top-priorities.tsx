"use client";

import React, { useRef, useEffect } from "react";

import { useAppStore } from "@papr/app/stores/appStore";

import { Draggable } from "@fullcalendar/interaction";
import { ClearRounded, DragIndicatorRounded } from "@mui/icons-material";

import styles from "./top-priorities.module.sass";

const TopPriorities = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const updateTopPriorities = useAppStore((state) => state.updateTopPriorities);

  const topPriorities = useAppStore(
    (state) => state.getDailyData(new Date(state.currentDate)).topPriorities
  );

  const inputRefs = useRef<(null | HTMLInputElement)[]>([]);
  const externalRef = useRef<HTMLDivElement>(null);

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...topPriorities];
    newPriorities[index] = value;
    updateTopPriorities(new Date(currentDateString), newPriorities);
  };

  const removeItem = (index: number) => {
    const newPriorities = [...topPriorities];
    newPriorities[index] = "";
    updateTopPriorities(new Date(currentDateString), newPriorities);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && index < topPriorities.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "Backspace" && topPriorities[index] === "" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContainerClick = (index: number) =>
    inputRefs.current[index]?.focus();

  useEffect(() => {
    if (externalRef.current) {
      new Draggable(externalRef.current, {
        itemSelector: ".fc-event",
        eventData: (eventEl: HTMLElement) => {
          const titleEl = eventEl.querySelector("input");
          const title = titleEl
            ? titleEl.value
            : `Priority ${eventEl.getAttribute("data-index") || ""}`;

          return {
            id: crypto.randomUUID(),
            title: title || "Untitled Priority",
          };
        },
      });
    }
  }, [topPriorities]);

  return (
    <div className={styles.topPriorities}>
      <h3 className={styles.title}>Top Priorities</h3>
      <div ref={externalRef} className={styles.grid}>
        {topPriorities.map((priority, index) => (
          <div
            key={index}
            data-index={index + 1}
            data-id={`tp-${index}`}
            onClick={() => handleContainerClick(index)}
            className={`fc-event ${styles.inputContainer}`}
          >
            <input
              type="text"
              value={priority}
              className={styles.input}
              placeholder={`Priority ${index + 1}`}
              onKeyDown={(e) => handleKeyDown(index, e)}
              // @ts-expect-error refs
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handlePriorityChange(index, e.target.value)}
            />

            {priority.length !== 0 && (
              <React.Fragment>
                <div className={styles.actions}>
                  <div
                    className={styles.clearInput}
                    onClick={() => removeItem(index)}
                  >
                    <ClearRounded />
                  </div>
                  <div className={styles.dragHandle}>
                    <DragIndicatorRounded />
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { TopPriorities };
