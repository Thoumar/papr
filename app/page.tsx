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

    // No destination (dropped outside a droppable)
    if (!destination) return;

    // Dropped in the same place
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
      // Dragged from TopPriorities to DailySchedule
      const dailyData = getDailyData(currentDate);
      const topPriorities = [...dailyData.topPriorities];
      const schedule = [...dailyData.schedule];

      // Find the dragged priority
      const draggedPriorityIndex = topPriorities.findIndex(
        (p, index) => `tp-${index}` === draggableId
      );
      const draggedPriority = topPriorities[draggedPriorityIndex];

      if (!draggedPriority) return;

      // Remove from TopPriorities
      topPriorities.splice(draggedPriorityIndex, 1);

      // Add to Schedule
      const newScheduleItem = {
        id: draggableId, // Use the draggableId for consistency
        title: draggedPriority,
        start: currentDateString, //  set start time.  Adjust as needed.
        // end: ... ,  // You might set a default duration, or handle this later
      };
      schedule.splice(destination.index, 0, newScheduleItem);

      // Update the store
      updateTopPriorities(currentDate, topPriorities);
      updateSchedule(currentDate, schedule);
    } else if (
      source.droppableId === "daily-schedule" &&
      destination.droppableId === "top-priorities"
    ) {
      // Dragged from DailySchedule to TopPriorities
      const dailyData = getDailyData(currentDate);
      const topPriorities = [...dailyData.topPriorities];
      const schedule = [...dailyData.schedule];

      // Find the dragged event
      const draggedEvent = schedule.find((event) => event.id === draggableId);

      if (!draggedEvent) return; // Should not happen, but good to check

      // Remove from Schedule
      const updatedSchedule = schedule.filter(
        (event) => event.id !== draggableId
      );

      // Add to TopPriorities, handling empty slots
      topPriorities.splice(destination.index, 0, draggedEvent.title); // Insert at the drop index
      // Remove trailing empty strings to keep the list compact
      while (
        topPriorities.length > 0 &&
        topPriorities[topPriorities.length - 1] === ""
      ) {
        topPriorities.pop();
      }
      // Ensure there's at least one empty slot for a new priority
      if (topPriorities.every((p) => p !== "")) {
        topPriorities.push("");
      }

      // Update the store
      updateTopPriorities(currentDate, topPriorities);
      updateSchedule(currentDate, updatedSchedule);
    } else if (source.droppableId === "top-priorities") {
      // Reordering within TopPriorities
      const dailyData = getDailyData(currentDate);
      const topPriorities = [...dailyData.topPriorities];

      // Reorder
      const draggedPriorityIndex = topPriorities.findIndex(
        (p, index) => `tp-${index}` === draggableId
      );

      const [reorderedItem] = topPriorities.splice(draggedPriorityIndex, 1);
      topPriorities.splice(destination.index, 0, reorderedItem);

      // Update the store
      updateTopPriorities(currentDate, topPriorities);
    } else if (source.droppableId === "daily-schedule") {
      // Reordering within DailySchedule
      const dailyData = getDailyData(currentDate);
      const schedule = [...dailyData.schedule];

      // Reorder
      const [reorderedItem] = schedule.splice(source.index, 1);
      schedule.splice(destination.index, 0, reorderedItem);

      // Update the store
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
            <TopPriorities /> <BrainDump />
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
