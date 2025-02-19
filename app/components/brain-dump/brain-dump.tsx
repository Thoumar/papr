"use client";

import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import styles from "./brain-dump.module.sass";

const BrainDump = () => {
  const [items, setItems] = useState([""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const externalRef = useRef<HTMLDivElement>(null);

  const handleItemChange = ({
    index,
    value,
  }: {
    index: number;
    value: string;
  }) => {
    const newItems = [...items];
    newItems[index] = value;
    // Add new input if last input is being typed and we haven't reached 100
    if (index === items.length - 1 && value && items.length < 100) {
      newItems.push("");
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    // Ensure we always have at least one empty input
    if (newItems.length === 0) {
      newItems.push("");
    }
    setItems(newItems);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && index < items.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "Backspace" && items[index] === "") {
      e.preventDefault();
      if (index > 0) {
        removeItem(index);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleListClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const lastInput = inputRefs.current[items.length - 1];
      lastInput?.focus();
    }
  };

  // Initialize FullCalendar draggable for BrainDump items
  useEffect(() => {
    if (externalRef.current) {
      new Draggable(externalRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          return {
            id: eventEl.getAttribute("data-id"),
            title: eventEl.getAttribute("data-title"),
          };
        },
      });
    }
  }, [items]);

  return (
    <div className={styles.brainDump}>
      <h2 className={styles.title}>Brain Dump</h2>
      <div className={styles.list} onClick={handleListClick} ref={externalRef}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`fc-event ${styles.inputContainer}`}
            data-id={`bd-${index}`}
            data-title={item}
          >
            <input
              // @ts-expect-error see later
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={item}
              onChange={(e) =>
                handleItemChange({ index, value: e.target.value })
              }
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
