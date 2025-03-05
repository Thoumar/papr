"use client";

import React, { useRef, useState, useEffect } from "react";

import { useAppStore } from "@papr/app/stores/appStore";

import { Draggable } from "@fullcalendar/interaction";
import { ClearRounded, DragIndicatorRounded } from "@mui/icons-material";

import styles from "./brain-dump.module.sass";

const BrainDump = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const getDailyData = useAppStore((state) => state.getDailyData);
  const updateBrainDumps = useAppStore((state) => state.updateBrainDumps);

  const inputRefs = useRef<(null | HTMLInputElement)[]>([]);
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
    if (externalRef.current) {
      new Draggable(externalRef.current, {
        itemSelector: ".fc-event",
        eventData: (eventEl: HTMLElement) => {
          // Explicitly get the title from the input field
          const titleEl = eventEl.querySelector("input");
          const title = titleEl
            ? titleEl.value
            : `Brain Dump ${eventEl.getAttribute("data-index") || ""}`;

          return {
            id: eventEl.getAttribute("data-id") || crypto.randomUUID(),
            title: title || "Untitled Dump",
          };
        },
      });
    }
  }, [brainDumps]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, brainDumps.length);
  }, [brainDumps]);

  return (
    <div className={styles.brainDump}>
      <h2 className={styles.title}>Brain Dump</h2>
      <div ref={externalRef} className={styles.list} onClick={handleListClick}>
        {brainDumps.map((item, index) => (
          <div
            key={index}
            data-index={index + 1}
            data-id={`bd-${index}`}
            className={`fc-event ${styles.inputContainer}`}
            onClick={() => inputRefs.current[index]?.focus()}
          >
            <input
              type="text"
              value={item}
              className={styles.input}
              placeholder={`Item ${index + 1}`}
              onKeyDown={(e) => handleKeyDown(index, e)}
              // @ts-expect-error will fix later
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleDumpChange(index, e.target.value)}
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

export { BrainDump };
