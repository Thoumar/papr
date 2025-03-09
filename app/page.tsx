"use client";

import { useAppStore } from "@papr/app/stores/appStore";
import { Header } from "@papr/app/components/header/header";
import { BrainDump } from "@papr/app/components/brain-dump/brain-dump";
import { SavedDates } from "@papr/app/components/saved-dates/saved-dates";
import { DailySchedule } from "@papr/app/components/daily-schedule/daily-schedule";
import { TopPriorities } from "@papr/app/components/top-priorities/top-priorities";

import { DropResult, DragDropContext } from "@hello-pangea/dnd";

import styles from "./page.module.sass";

export default function Home() {
  const updateTopPriorities = useAppStore((state) => state.updateTopPriorities);
  const updateSchedule = useAppStore((state) => state.updateSchedule);
  const getDailyData = useAppStore((state) => state.getDailyData);
  const currentDateString = useAppStore((state) => state.currentDate);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const currentDate = new Date(currentDateString);

    if (
      source.droppableId === "top-priorities" &&
      destination.droppableId === "daily-schedule"
    ) {
      const dailyData = getDailyData(currentDate);
      const topPriorities = [...dailyData.topPriorities];
      const schedule = [...dailyData.schedule];

      const draggedPriorityIndex = topPriorities.findIndex(
        (p, index) => `tp-${index}` === draggableId
      );
      const draggedPriority = topPriorities[draggedPriorityIndex];

      if (!draggedPriority) return;

      topPriorities.splice(draggedPriorityIndex, 1);

      const newScheduleItem = {
        id: draggableId,
        title: draggedPriority,
        start: currentDateString,
      };
      schedule.splice(destination.index, 0, newScheduleItem);

      updateTopPriorities(currentDate, topPriorities);
      updateSchedule(currentDate, schedule);
    } else if (
      source.droppableId === "daily-schedule" &&
      destination.droppableId === "top-priorities"
    ) {
      const dailyData = getDailyData(currentDate);
      const topPriorities = [...dailyData.topPriorities];
      const schedule = [...dailyData.schedule];

      const draggedEvent = schedule.find((event) => event.id === draggableId);

      if (!draggedEvent) return;

      const updatedSchedule = schedule.filter(
        (event) => event.id !== draggableId
      );

      topPriorities.splice(destination.index, 0, draggedEvent.title);
      while (
        topPriorities.length > 0 &&
        topPriorities[topPriorities.length - 1] === ""
      ) {
        topPriorities.pop();
      }
      if (topPriorities.every((p) => p !== "")) {
        topPriorities.push("");
      }

      updateTopPriorities(currentDate, topPriorities);
      updateSchedule(currentDate, updatedSchedule);
    } else if (source.droppableId === "top-priorities") {
      const dailyData = getDailyData(currentDate);
      const topPriorities = [...dailyData.topPriorities];

      const draggedPriorityIndex = topPriorities.findIndex(
        (p, index) => `tp-${index}` === draggableId
      );

      const [reorderedItem] = topPriorities.splice(draggedPriorityIndex, 1);
      topPriorities.splice(destination.index, 0, reorderedItem);

      updateTopPriorities(currentDate, topPriorities);
    } else if (source.droppableId === "daily-schedule") {
      const dailyData = getDailyData(currentDate);
      const schedule = [...dailyData.schedule];

      const [reorderedItem] = schedule.splice(source.index, 1);
      schedule.splice(destination.index, 0, reorderedItem);

      updateSchedule(currentDate, schedule);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.page}>
        <div className={styles.sidebarLeft}>
          <SavedDates />
        </div>
        <main className={styles.main}>
          <Header />
          <div className={styles.left}>
            <TopPriorities />
            <BrainDump />
          </div>
          <div className={styles.right}>
            <DailySchedule />
          </div>
        </main>
        <div className={styles.sidebarRight}></div>
      </div>
    </DragDropContext>
  );
}
