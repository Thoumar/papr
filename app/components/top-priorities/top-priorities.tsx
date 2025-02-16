"use client";

import { useState, useRef } from "react";
import styles from "./top-priorities.module.sass";
import { Lexend } from "@/app/fonts";
import clsx from "clsx";

const TopPriorities = () => {
  const [priorities, setPriorities] = useState(["", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      e.preventDefault(); // Prevent the default backspace behavior
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContainerClick = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  return (
    <div className={styles.topPriorities}>
      <h2 className={clsx([Lexend, styles.title])}>Top Priorities</h2>
      <div className={styles.grid}>
        {priorities.map((priority, index) => (
          <div
            key={index}
            className={styles.inputContainer}
            onClick={() => handleContainerClick(index)}
          >
            <input
              // @ts-expect-error Need to be fixed
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={priority}
              onChange={(e) => {
                handlePriorityChange({ index, value: e.target.value });
              }}
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
