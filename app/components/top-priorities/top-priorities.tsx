"use client";

import React, { useRef, useEffect } from "react";

import { Lexend } from "@papr/app/fonts";
import { useAppStore } from "@papr/app/stores/appStore";

import { Draggable } from "@fullcalendar/interaction";
import { ClearRounded, DragIndicatorRounded } from "@mui/icons-material";

import clsx from "clsx";

import styles from "./top-priorities.module.sass";

const TopPriorities = () => {
  const getDailyData = useAppStore((state) => state.getDailyData);
  const currentDateString = useAppStore((state) => state.currentDate);
  const updateTopPriorities = useAppStore((state) => state.updateTopPriorities);

  const topPriorities = useAppStore(
    (state) => state.getDailyData(new Date(state.currentDate)).topPriorities
  );

  const inputRefs = useRef<(null | HTMLInputElement)[]>([]);
  const externalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const currentDate = new Date(currentDateString);
      const dailyData = getDailyData(currentDate);
      updateTopPriorities(currentDate, dailyData.topPriorities);
    } catch (error) {
      console.error("Error fetching top priorities:", error);
      updateTopPriorities(new Date(currentDateString), []);
    }
  }, [currentDateString, getDailyData, updateTopPriorities]);

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
          // Explicitly get the title from the input field
          const titleEl = eventEl.querySelector("input");
          const title = titleEl
            ? titleEl.value
            : `Priority ${eventEl.getAttribute("data-index") || ""}`;

          return {
            id: eventEl.getAttribute("data-id") || crypto.randomUUID(),
            title: title || "Untitled Priority",
          };
        },
      });
    }
  }, [topPriorities]);

  return (
    <div className={styles.topPriorities}>
      <h2 className={clsx([Lexend, styles.title])}>Top Priorities</h2>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export { TopPriorities };
