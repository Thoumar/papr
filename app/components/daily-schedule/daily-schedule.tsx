"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import styles from "./daily-schedule.module.sass";

type Task = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type Event = {
  id: string;
  title: string;
};

const DailySchedule = () => {
  const [calendarEvents, setCalendarEvents] = useState<Task[]>([]);
  const [, setExternalEvents] = useState<Event[]>([]);
  const externalElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalElRef.current) {
      new Draggable(externalElRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl: any) {
          return {
            id: eventEl.getAttribute("data-id"),
            title: eventEl.getAttribute("data-title"),
          };
        },
      });
    }
  }, []);

  const handleEventReceive = (info: any) => {
    setCalendarEvents((prev) => [
      ...prev,
      {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
      },
    ]);
    setExternalEvents((prev) => prev.filter((ev) => ev.id !== info.event.id));
  };

  const handleEventDrop = (info: any) => {
    const { id, start, end } = info.event;
    setCalendarEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, start, end } : ev))
    );
  };

  const handleEventDragStop = (info: any) => {
    const externalEl = externalElRef.current;
    if (externalEl) {
      const rect = externalEl.getBoundingClientRect();
      const { clientX, clientY } = info.jsEvent;
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const eventId = info.event.id;
        setCalendarEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        setExternalEvents((prev) => [
          ...prev,
          { id: eventId, title: info.event.title },
        ]);
      }
    }
  };

  return (
    <div
      className={styles.dailySchedule}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h2 className={styles.title}>Scedule</h2>
      <div className={styles.schedule}>
        <FullCalendar
          headerToolbar={false}
          allDaySlot={false}
          dayHeaders={false}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          nowIndicator={true}
          editable={true}
          droppable={true}
          events={calendarEvents}
          eventReceive={handleEventReceive}
          eventDrop={handleEventDrop}
          eventDragStop={handleEventDragStop}
          eventBackgroundColor="white"
          eventBorderColor="black"
          eventTextColor="black"
          height="auto"
        />
      </div>
    </div>
  );
};

export { DailySchedule };
