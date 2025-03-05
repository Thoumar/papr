import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ScheduleEvent {
  id: string;
  end?: string;
  title: string;
  start: string;
}

interface DailyData {
  brainDumps: string[];
  topPriorities: string[];
  schedule: ScheduleEvent[];
}

interface AppStore {
  currentDate: string;
  favorites: string[];
  clearDay: (date: Date) => void;
  addFavorite: (date: string) => void;
  removeFavorite: (date: string) => void;
  getDailyData: (date: Date) => DailyData;
  dataByDate: { [date: string]: DailyData };
  updateBrainDumps: (date: Date, brainDumps: string[]) => void;
  updateSchedule: (date: Date, schedule: ScheduleEvent[]) => void;
  updateTopPriorities: (date: Date, priorities: string[]) => void;
  setCurrentDate: (date: Date | ((prevDate: Date) => Date)) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      dataByDate: {},
      currentDate: new Date().toISOString(),
      removeFavorite: (date) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== date),
        }));
      },
      addFavorite: (date) => {
        set((state) => ({
          favorites: state.favorites.includes(date)
            ? state.favorites
            : [...state.favorites, date],
        }));
      },
      getDailyData: (date) => {
        const dateString = date.toISOString().split("T")[0];
        return (
          get().dataByDate[dateString] || {
            schedule: [],
            brainDumps: [""],
            topPriorities: ["", "", ""],
          }
        );
      },
      clearDay: (date) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => {
          const newDataByDate = { ...state.dataByDate };
          newDataByDate[dateString] = {
            schedule: [],
            brainDumps: [""],
            topPriorities: ["", "", ""],
          };
          return { dataByDate: newDataByDate };
        });
      },
      updateSchedule: (date, schedule) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => ({
          dataByDate: {
            ...state.dataByDate,
            [dateString]: {
              ...(state.dataByDate[dateString] || {
                schedule: [],
                brainDumps: [""],
                topPriorities: ["", "", ""],
              }),
              schedule,
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
                schedule: [],
                brainDumps: [""],
                topPriorities: ["", "", ""],
              }),
              brainDumps,
            },
          },
        }));
      },
      updateTopPriorities: (date, priorities) => {
        const dateString = date.toISOString().split("T")[0];
        set((state) => ({
          dataByDate: {
            ...state.dataByDate,
            [dateString]: {
              ...(state.dataByDate[dateString] || {
                schedule: [],
                brainDumps: [""],
                topPriorities: ["", "", ""],
              }),
              topPriorities: priorities,
            },
          },
        }));
      },
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
    }),
    {
      name: "papr-storage",
    }
  )
);
