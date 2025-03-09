"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import FullCalendar from "@fullcalendar/react";
import React, { useRef, useState, useEffect } from "react";

import { useAppStore } from "@papr/app/stores/appStore";

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import styles from "./daily-schedule.module.sass";

interface ScheduleEvent {
  id: string;
  end?: string;
  title: string;
  start: string;
}

const DailySchedule = () => {
  const currentDateString = useAppStore((state) => state.currentDate);
  const updateSchedule = useAppStore((state) => state.updateSchedule);
  const getDailyData = useAppStore((state) => state.getDailyData);
  const currentDate = new Date(currentDateString);

  const calendarEvents = useAppStore(
    (state) => state.getDailyData(new Date(state.currentDate)).schedule
  );

  const dateKey = currentDate.toISOString().split("T")[0];

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [processingEvent, setProcessingEvent] = useState<null | string>(null);

  const externalElRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const dailyData = getDailyData(currentDate);

    const newEvents = dailyData.schedule.map((task) => ({
      id: task.id,
      end: task.end,
      title: task.title,
      start: task.start,
    }));

    updateSchedule(new Date(currentDateString), newEvents);
    setIsInitialLoad(false);
  }, [currentDateString, getDailyData]);

  useEffect(() => {
    if (isInitialLoad) return;

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

    updateSchedule(currentDate, scheduleEvents);
  }, [isInitialLoad]);

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
    if (processingEvent === info.event.id) return;

    setProcessingEvent(info.event.id);

    // Convert EventInput to ScheduleEvent with required properties
    const newEvent: ScheduleEvent = {
      id: info.event.id || crypto.randomUUID(),
      end: info.event.endStr || undefined,
      title: info.event.title || "Untitled Task",
      start: info.event.startStr || currentDateString,
    };

    if (calendarRef.current) {
      const apiEvent = calendarRef.current.getApi().getEventById(info.event.id);
      if (apiEvent) {
        apiEvent.remove();
      }
    }

    // Replace local setState with Zustand store update
    const updatedEvents: ScheduleEvent[] = [...calendarEvents];
    const isDuplicate = updatedEvents.some(
      (existingEvent) =>
        existingEvent.id === newEvent.id ||
        (existingEvent.title === newEvent.title &&
          existingEvent.start === newEvent.start &&
          existingEvent.end === newEvent.end)
    );

    if (!isDuplicate) {
      updateSchedule(currentDate, [...updatedEvents, newEvent]);
    }

    setTimeout(() => {
      setProcessingEvent(null);
    }, 100);
  };

  const handleEventDrop = (info: any) => {
    if (processingEvent === info.event.id) return;
    setProcessingEvent(info.event.id);

    // Replace local setState with Zustand store update
    const updatedEvents: ScheduleEvent[] = calendarEvents.map((ev) =>
      ev.id === info.event.id
        ? {
            ...ev,
            end: info.event.endStr,
            start: info.event.startStr,
          }
        : ev
    );

    updateSchedule(currentDate, updatedEvents);

    setTimeout(() => {
      setProcessingEvent(null);
    }, 100);
  };

  const handleEventResize = (info: any) => {
    if (processingEvent === info.event.id) return;

    setProcessingEvent(info.event.id);

    // Replace local setState with Zustand store update
    const updatedEvents: ScheduleEvent[] = calendarEvents.map((ev) =>
      ev.id === info.event.id
        ? {
            ...ev,
            end: info.event.endStr,
            start: info.event.startStr,
          }
        : ev
    );

    updateSchedule(currentDate, updatedEvents);

    setTimeout(() => {
      setProcessingEvent(null);
    }, 100);
  };

  const handleEventRemove = (info: any) => {
    // Replace local setState with Zustand store update
    const updatedEvents: ScheduleEvent[] = calendarEvents.filter(
      (ev) => ev.id !== info.event.id
    );
    updateSchedule(currentDate, updatedEvents);
  };

  const renderEventContent = (eventInfo: any) => (
    <div className={styles.event}>
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
      <h3 className={styles.title}>Schedule</h3>
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
