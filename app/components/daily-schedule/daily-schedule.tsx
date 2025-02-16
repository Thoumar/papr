/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Droppable, DragDropContext, Draggable } from "@hello-pangea/dnd";
import styles from "./daily-schedule.module.sass";

type TimeSlot = {
  time: string;
  items: Array<{ id: string; content: string }>;
};

const generateTimeSlots = () => {
  const slots: TimeSlot[] = [];
  for (let hour = 5; hour <= 24; hour++) {
    const time =
      hour === 24
        ? "12:00 AM"
        : `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`;
    slots.push({ time, items: [] });
  }
  return slots;
};

const DailySchedule = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    const sourceSlot = timeSlots[source.droppableId];
    const destSlot = timeSlots[destination.droppableId];

    // Create updated slots
    const newTimeSlots = [...timeSlots];
    const [movedItem] = sourceSlot.items.splice(source.index, 1);
    destSlot.items.splice(destination.index, 0, movedItem);

    setTimeSlots(newTimeSlots);
  };

  return (
    <div className={styles.dailySchedule}>
      <h2 className={styles.title}>Schedule</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.schedule}>
          {timeSlots.map((slot, index) => (
            <div key={slot.time} className={styles.timeSlot}>
              <span className={styles.time}>{slot.time}</span>
              <Droppable droppableId={index.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.dropZone}
                  >
                    {slot.items.map((item, itemIndex) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={itemIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.item}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export { DailySchedule };
