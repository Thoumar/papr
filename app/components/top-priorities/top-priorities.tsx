/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import styles from "./top-priorities.module.sass";
import { Lexend } from "@/app/fonts";
import clsx from "clsx";
import { useAppStore } from "@/app/stores/appStore";

const TopPriorities = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const getDailyData = useAppStore((state) => state.getDailyData);
  const updateTopPriorities = useAppStore((state) => state.updateTopPriorities);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const externalRef = useRef<HTMLDivElement>(null);

  const [topPriorities, setTopPriorities] = useState<string[]>([]);

  useEffect(() => {
    try {
      const currentDate = new Date(currentDateString);
      const dailyData = getDailyData(currentDate);
      setTopPriorities(dailyData.topPriorities);
    } catch (error) {
      console.error("Error fetching top priorities:", error);
      setTopPriorities([]);
    }
  }, [currentDateString, getDailyData]);

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...topPriorities];
    newPriorities[index] = value;
    setTopPriorities(newPriorities);
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
        eventData: (eventEl: any) => ({
          id: eventEl.getAttribute("data-id"),
          title: eventEl.getAttribute("data-title"),
        }),
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
            className={`fc-event ${styles.inputContainer}`}
            data-id={`tp-${index}`}
            onClick={() => handleContainerClick(index)}
          >
            <input
              // @ts-expect-error refs
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={priority}
              onChange={(e) => handlePriorityChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.input}
              placeholder={`Priority ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export { TopPriorities };
