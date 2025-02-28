import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DailyData {
  topPriorities: string[];
  schedule: string[];
  brainDumps: string[];
}

interface AppStore {
  dataByDate: { [date: string]: DailyData };
  currentDate: string; // Store as ISO string
  setCurrentDate: (date: Date | ((prevDate: Date) => Date)) => void;
  updateTopPriorities: (date: Date, priorities: string[]) => void;
  updateSchedule: (date: Date, schedule: string[]) => void;
  updateBrainDumps: (date: Date, brainDumps: string[]) => void;
  getDailyData: (date: Date) => DailyData;
  clearDay: (date: Date) => void; // New function
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      dataByDate: {},
      currentDate: new Date().toISOString(),
      setCurrentDate: (dateOrUpdater) => {
        if (typeof dateOrUpdater === "function") {
          const currentDateObj = new Date(get().currentDate);
          if (!isNaN(currentDateObj.getTime())) {
            const newDateObj = dateOrUpdater(currentDateObj);
            set({ currentDate: newDateObj.toISOString() });
          } else {
            set({ currentDate: new Date().toISOString() });
          }
        } else {
          set({ currentDate: dateOrUpdater.toISOString() });
        }
      },
      updateTopPriorities: (date, priorities) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => ({
          dataByDate: {
            ...state.dataByDate,
            [dateString]: {
              ...(state.dataByDate[dateString] || {
                topPriorities: ["", "", ""],
                schedule: [],
                brainDumps: [""],
              }),
              topPriorities: priorities,
            },
          },
        }));
      },
      updateSchedule: (date, schedule) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => ({
          dataByDate: {
            ...state.dataByDate,
            [dateString]: {
              ...(state.dataByDate[dateString] || {
                topPriorities: ["", "", ""],
                schedule: [],
                brainDumps: [""],
              }),
              schedule: schedule,
            },
          },
        }));
      },
      updateBrainDumps: (date, brainDumps) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => ({
          dataByDate: {
            ...state.dataByDate,
            [dateString]: {
              ...(state.dataByDate[dateString] || {
                topPriorities: ["", "", ""],
                schedule: [],
                brainDumps: [""],
              }),
              brainDumps: brainDumps,
            },
          },
        }));
      },
      getDailyData: (date) => {
        const dateString = date.toISOString().split("T")[0];
        return (
          get().dataByDate[dateString] || {
            topPriorities: ["", "", ""],
            schedule: [],
            brainDumps: [""],
          }
        );
      },
      clearDay: (date) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => {
          const newDataByDate = { ...state.dataByDate };
          delete newDataByDate[dateString]; // Remove all data for the given day
          return { dataByDate: newDataByDate };
        });
      },
    }),
    {
      name: "papr-storage",
    }
  )
);
