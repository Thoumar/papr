/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FullCalendar from "@fullcalendar/react";
import React, { useRef, useState, useEffect } from "react";

import { useAppStore } from "@papr/app/stores/appStore";

import { EventInput } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import styles from "./daily-schedule.module.sass";

const DailySchedule = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const updateSchedule = useAppStore((state) => state.updateSchedule);
  const getDailyData = useAppStore((state) => state.getDailyData);
  const currentDate = new Date(currentDateString);

  // State to manage calendar events
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

  const externalElRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Load events for the current date whenever the date changes
  useEffect(() => {
    // Get schedule for the current date
    const dailyData = getDailyData(currentDate);

    // Convert store events to FullCalendar events
    const newEvents = dailyData.schedule.map((task) => ({
      id: task.id,
      end: task.end,
      title: task.title,
      start: task.start,
    }));

    // Update calendar events
    setCalendarEvents(newEvents);
  }, [currentDateString, getDailyData]);

  // Update store when calendar events change
  useEffect(() => {
    // Convert calendar events to schedule events for the store
    const scheduleEvents = calendarEvents.map((event) => ({
      id: event.id || crypto.randomUUID(),
      title: event.title || "Untitled Task",
      start: typeof event.start === "string" ? event.start : currentDateString,
      end: event.end
        ? typeof event.end === "string"
          ? event.end
          : undefined
        : undefined,
    }));

    // Update the schedule in the store for the current date
    updateSchedule(currentDate, scheduleEvents);
  }, [calendarEvents, currentDate, updateSchedule]);

  // Draggable setup
  useEffect(() => {
    if (externalElRef.current) {
      new Draggable(externalElRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl: HTMLElement) {
          return {
            id: crypto.randomUUID(), // Always generate a new ID
            start: currentDateString,
            title: eventEl.getAttribute("data-title") || "Untitled Task",
          };
        },
      });
    }
  }, [currentDateString]);

  const handleEventReceive = (info: any) => {
    console.log(info);
    // Prevent immediate duplication by checking if the event already exists
    const newEvent: EventInput = {
      id: crypto.randomUUID(),
      end: info.event.endStr || undefined,
      title: info.event.title || "Untitled Task",
      start: info.event.startStr || currentDateString,
    };

    setCalendarEvents((prev) => {
      // Use a more strict comparison to prevent duplicates
      const isDuplicate = prev.some(
        (existingEvent) =>
          existingEvent.title === newEvent.title &&
          existingEvent.start === newEvent.start &&
          existingEvent.end === newEvent.end
      );

      if (isDuplicate) {
        return prev;
      }

      return [...prev, newEvent];
    });
  };

  const handleEventDrop = (info: any) => {
    setCalendarEvents((prev) =>
      prev.map((ev) =>
        ev.id === info.event.id
          ? {
              ...ev,
              end: info.event.endStr || undefined,
              start: info.event.startStr || currentDateString,
            }
          : ev
      )
    );
  };

  const handleEventRemove = (info: any) => {
    setCalendarEvents((prev) => prev.filter((ev) => ev.id !== info.event.id));
  };

  return (
    <div
      className={styles.dailySchedule}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h2 className={styles.title}>Schedule</h2>

      {/* External Events Container */}
      <div ref={externalElRef} className={styles.externalEvents}>
        {/* You can add external events here if needed */}
      </div>

      <div className={styles.schedule}>
        <FullCalendar
          height="auto"
          editable={true}
          droppable={true}
          ref={calendarRef}
          allDaySlot={false}
          dayHeaders={false}
          nowIndicator={true}
          headerToolbar={false}
          eventTextColor="black"
          key={currentDateString}
          events={calendarEvents}
          eventBorderColor="black"
          initialView="timeGridDay"
          eventDrop={handleEventDrop}
          eventBackgroundColor="white"
          eventRemove={handleEventRemove}
          eventReceive={handleEventReceive}
          plugins={[timeGridPlugin, interactionPlugin]}
        />
      </div>
    </div>
  );
};

export { DailySchedule };
