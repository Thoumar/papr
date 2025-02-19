/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import styles from "./top-priorities.module.sass";
import { Lexend } from "@/app/fonts";
import clsx from "clsx";

const TopPriorities = () => {
  const [priorities, setPriorities] = useState(["", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const externalRef = useRef<HTMLDivElement>(null);

  const handlePriorityChange = ({
    index,
    value,
  }: {
    index: number;
    value: string;
  }) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && index < priorities.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "Backspace" && priorities[index] === "" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContainerClick = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (externalRef.current) {
      new Draggable(externalRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl: any) {
          return {
            id: eventEl.getAttribute("data-id"),
            title: eventEl.getAttribute("data-title"),
          };
        },
      });
    }
  }, [priorities]);

  return (
    <div className={styles.topPriorities}>
      <h2 className={clsx([Lexend, styles.title])}>Top Priorities</h2>
      <div ref={externalRef} className={styles.grid}>
        {priorities.map((priority, index) => (
          <div
            key={index}
            className={`fc-event ${styles.inputContainer}`}
            data-id={`tp-${index}`}
            data-title={priority}
            onClick={() => handleContainerClick(index)}
          >
            <input
              // @ts-expect-error later
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={priority}
              onChange={(e) =>
                handlePriorityChange({ index, value: e.target.value })
              }
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
