"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

  // Extract just the date part for consistency with store
  const dateKey = currentDate.toISOString().split("T")[0];

  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [processingEvent, setProcessingEvent] = useState<null | string>(null);

  const externalElRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Load initial data from store
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

    setCalendarEvents(newEvents);
    setIsInitialLoad(false);
  }, [currentDateString, getDailyData]);

  // Update store when calendar events change (but not on initial load)
  useEffect(() => {
    if (isInitialLoad) return;

    const scheduleEvents = calendarEvents.map((event) => ({
      id: event.id || crypto.randomUUID(),
      title: event.title || "Untitled Task",
      // Ensure consistent date format
      start: typeof event.start === "string" ? event.start : currentDateString,
      end: event.end
        ? typeof event.end === "string"
          ? event.end
          : undefined
        : undefined,
    }));

    updateSchedule(currentDate, scheduleEvents);
  }, [calendarEvents, isInitialLoad]);

  // Setup draggable events
  useEffect(() => {
    if (externalElRef.current) {
      new Draggable(externalElRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl: HTMLElement) {
          const eventId = crypto.randomUUID();
          return {
            id: eventId,
            start: currentDateString,
            title: eventEl.getAttribute("data-title") || "Untitled Task",
          };
        },
      });
    }
  }, [currentDateString]);

  const handleEventReceive = (info: any) => {
    // Prevent processing if we're already handling an event
    if (processingEvent === info.event.id) return;

    // Set that we're processing this event
    setProcessingEvent(info.event.id);

    // Create a new event with proper ID and format
    const newEvent: EventInput = {
      id: info.event.id || crypto.randomUUID(),
      end: info.event.endStr || undefined,
      title: info.event.title || "Untitled Task",
      start: info.event.startStr || currentDateString,
    };

    // First remove the API-created event to prevent duplication
    if (calendarRef.current) {
      const apiEvent = calendarRef.current.getApi().getEventById(info.event.id);
      if (apiEvent) {
        apiEvent.remove();
      }
    }

    // Then add our controlled version of the event
    setCalendarEvents((prev) => {
      // Check for duplicates
      const isDuplicate = prev.some(
        (existingEvent) =>
          existingEvent.id === newEvent.id ||
          (existingEvent.title === newEvent.title &&
            existingEvent.start === newEvent.start &&
            existingEvent.end === newEvent.end)
      );

      if (isDuplicate) {
        return prev;
      }

      return [...prev, newEvent];
    });

    // Clear processing state after a short delay
    setTimeout(() => {
      setProcessingEvent(null);
    }, 100);
  };

  const handleEventDrop = (info: any) => {
    // Prevent processing if we're already handling an event
    if (processingEvent === info.event.id) return;

    // Set that we're processing this event
    setProcessingEvent(info.event.id);

    if (info.event.remove) {
      handleEventRemove(info);
      return;
    }

    // Update the event in our state with both start and end times
    setCalendarEvents((prev) =>
      prev.map((ev) =>
        ev.id === info.event.id
          ? {
              ...ev,
              end: info.event.endStr,
              // Explicitly capture both start and end times
              start: info.event.startStr,
            }
          : ev
      )
    );

    // Clear processing state after a short delay
    setTimeout(() => {
      setProcessingEvent(null);
    }, 100);
  };

  // Add event resize handler
  const handleEventResize = (info: any) => {
    // Prevent processing if we're already handling an event
    if (processingEvent === info.event.id) return;

    // Set that we're processing this event
    setProcessingEvent(info.event.id);

    // Update the event in our state, making sure to capture both start and end
    setCalendarEvents((prev) =>
      prev.map((ev) =>
        ev.id === info.event.id
          ? {
              ...ev,
              end: info.event.endStr,
              start: info.event.startStr,
            }
          : ev
      )
    );

    // Clear processing state after a short delay
    setTimeout(() => {
      setProcessingEvent(null);
    }, 100);
  };

  const handleEventRemove = (info: any) => {
    setCalendarEvents((prev) => prev.filter((ev) => ev.id !== info.event.id));
  };

  const renderEventContent = (eventInfo: any) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{eventInfo.event.title}</span>
      <span
        className={styles.closeBtn}
        onClick={(e) => {
          e.stopPropagation();
          handleEventRemove({ event: eventInfo.event });
        }}
      >
        ×
      </span>
    </div>
  );

  return (
    <div
      className={styles.dailySchedule}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h2 className={styles.title}>Schedule</h2>
      <div className={styles.schedule}>
        <FullCalendar
          height="auto"
          key={dateKey}
          editable={true}
          droppable={true}
          ref={calendarRef}
          allDaySlot={false}
          dayHeaders={false}
          nowIndicator={true}
          headerToolbar={false}
          eventTextColor="black"
          events={calendarEvents}
          eventBorderColor="black"
          initialView="timeGridDay"
          eventDrop={handleEventDrop}
          eventBackgroundColor="white"
          eventResize={handleEventResize}
          eventRemove={handleEventRemove}
          eventReceive={handleEventReceive}
          eventContent={renderEventContent}
          plugins={[timeGridPlugin, interactionPlugin]}
        />
      </div>
    </div>
  );
};

export { DailySchedule };
