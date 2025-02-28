"use client";

import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import styles from "./brain-dump.module.sass";
import { useAppStore } from "@/app/stores/appStore";

const BrainDump = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const getDailyData = useAppStore((state) => state.getDailyData);
  const updateBrainDumps = useAppStore((state) => state.updateBrainDumps);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const externalRef = useRef<HTMLDivElement>(null);

  const [brainDumps, setBrainDumps] = useState<string[]>([""]);

  useEffect(() => {
    try {
      const currentDate = new Date(currentDateString);
      const dailyData = getDailyData(currentDate);
      setBrainDumps(dailyData.brainDumps);
    } catch (error) {
      console.error("Error fetching top priorities:", error);
      setBrainDumps([]);
    }
  }, [currentDateString, getDailyData]);

  const handleDumpChange = (index: number, value: string) => {
    const newBrainDumps = [...brainDumps];
    newBrainDumps[index] = value;
    if (index === brainDumps.length - 1 && value && brainDumps.length < 100) {
      newBrainDumps.push("");
    }
    setBrainDumps(newBrainDumps);
    updateBrainDumps(new Date(currentDateString), newBrainDumps);
  };

  const removeItem = (index: number) => {
    const newDumps = brainDumps.filter((_, i) => i !== index);
    if (newDumps.length === 0) {
      newDumps.push("");
    }
    setBrainDumps(newDumps);
  };

  useEffect(() => {
    try {
      const currentDate = new Date(currentDateString);
      const dailyData = getDailyData(currentDate);
      setBrainDumps(dailyData.brainDumps);
    } catch (error) {
      console.error("Error fetching top priorities:", error);
      setBrainDumps([]);
    }
  }, [currentDateString, getDailyData]);

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && index < brainDumps.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "Backspace" && brainDumps[index] === "") {
      e.preventDefault();
      if (index > 0) {
        removeItem(index);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleListClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      inputRefs.current[brainDumps.length - 1]?.focus();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && externalRef.current) {
      new Draggable(externalRef.current, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => ({
          id: eventEl.getAttribute("data-id"),
          title: eventEl.getAttribute("data-title") || " ",
        }),
      });
    }
  }, [brainDumps]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, brainDumps.length);
  }, [brainDumps]);

  return (
    <div className={styles.brainDump}>
      <h2 className={styles.title}>Brain Dump</h2>
      <div className={styles.list} onClick={handleListClick} ref={externalRef}>
        {brainDumps.map((item, index) => (
          <div
            key={index}
            className={`fc-event ${styles.inputContainer}`}
            data-id={`bd-${index}`}
            // data-title={item || " "}
            onClick={() => inputRefs.current[index]?.focus()}
          >
            <input
              // @ts-expect-error will fix later
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={item}
              onChange={(e) => handleDumpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.input}
              placeholder={`Item ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export { BrainDump };
