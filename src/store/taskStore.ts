import { create } from "zustand";
import { Task, readTasks, writeTasks } from "@/services/fileManager.ts";
import { TaskTreeUtils, TaskWithLevel } from "@/services/taskTree.ts";
import { loadTranslations as i18nLoad, t, TKey } from "@/services/i18n.ts";

type Mode = "list" | "add" | "edit" | "error" | "loading";

interface TaskState {
  // State
  tasks: TaskWithLevel[];
  selected: number;
  mode: Mode;
  inputValue: string;
  message: string | null;
  lang: string;
  filePath: string;

  // Actions
  init: (lang: string, filePath?: string) => Promise<void>;
  setMode: (mode: Mode) => void;
  setInputValue: (value: string) => void;
  clearMessage: () => void;
  moveUp: () => void;
  moveDown: () => void;
  moveTaskUp: () => void;
  moveTaskDown: () => void;
  addTask: () => void;
  toggleTask: () => void;
  deleteTask: () => void;
  editTask: (newLabel: string) => void;
  promoteTask: () => void;
  demoteTask: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // --- INITIAL STATE ---
  tasks: [],
  selected: 0,
  mode: "loading",
  inputValue: "",
  message: null,
  lang: "en",
  filePath: "todo.md",

  // --- ACTIONS ---

  /**
   * Initializes the application by loading translations and tasks.
   */
  init: async (lang: string, filePath = "todo.md") => {
    try {
      await i18nLoad(lang);
      const tasks = await readTasks(filePath);
      set({ lang, tasks, mode: "list", filePath });
    } catch (err: any) {
      set({ mode: "error", message: err.message });
    }
  },

  setMode: (mode: Mode) => set({ mode }),

  setInputValue: (value: string) => set({ inputValue: value }),

  clearMessage: () => set({ message: null }),

  moveUp: () => {
    const { tasks, selected } = get();
    if (tasks.length === 0) return;
    const newSelected = selected > 0 ? selected - 1 : tasks.length - 1;
    set({ selected: newSelected });
  },

  moveDown: () => {
    const { tasks, selected } = get();
    if (tasks.length === 0) return;
    const newSelected = selected < tasks.length - 1 ? selected + 1 : 0;
    set({ selected: newSelected });
  },

  moveTaskUp: () => {
    const { tasks, selected, filePath } = get();
    if (selected <= 0 || tasks.length <= 1) return;

    // 检查是否可以向上移动
    const targetIndex = Math.max(0, selected - 1);
    if (!TaskTreeUtils.canMoveTaskToPosition(tasks, selected, targetIndex)) {
      set({ message: t("messageCannotMove") });
      return;
    }

    // 移动任务及其子任务
    const newTasks = TaskTreeUtils.moveTaskWithChildren(tasks, selected, targetIndex);
    
    // 更新选中位置
    const newSelected = Math.max(0, selected - 1);
    
    set({
      tasks: newTasks,
      selected: newSelected,
    });
    writeTasks(newTasks, filePath);
  },

  moveTaskDown: () => {
    const { tasks, selected, filePath } = get();
    if (selected >= tasks.length - 1 || tasks.length <= 1) return;

    // 获取任务及其子任务的数量
    const childIndices = TaskTreeUtils.getChildTaskIndices(tasks, selected);
    const totalTasksToMove = childIndices.length + 1;
    
    // 检查是否可以向下移动
    const targetIndex = Math.min(tasks.length - totalTasksToMove, selected + totalTasksToMove);
    if (!TaskTreeUtils.canMoveTaskToPosition(tasks, selected, targetIndex)) {
      set({ message: t("messageCannotMove") });
      return;
    }

    // 移动任务及其子任务
    const newTasks = TaskTreeUtils.moveTaskWithChildren(tasks, selected, targetIndex);
    
    // 更新选中位置
    const newSelected = Math.min(tasks.length - 1, selected + 1);
    
    set({
      tasks: newTasks,
      selected: newSelected,
    });
    writeTasks(newTasks, filePath);
  },

  addTask: () => {
    const { inputValue, tasks, mode, selected } = get();
    if (inputValue) {
      let newTasks;
      let messageKey;

      if (mode === "edit") {
        newTasks = tasks.map((task, i) =>
          i === selected ? { ...task, label: inputValue } : task
        );
        messageKey = "messageEdited";
      } else {
        newTasks = [...tasks, { label: inputValue, completed: false, level: 0 }];
        messageKey = "messageAdded";
      }

      set({
        tasks: newTasks,
        message: t(messageKey as TKey, { task: inputValue }),
      });
      writeTasks(newTasks, get().filePath);
    }
    set({ inputValue: "", mode: "list" });
  },

  toggleTask: () => {
    const { tasks, selected } = get();
    if (tasks[selected]) {
      // 使用任务树工具类切换任务状态
      const newTasks = TaskTreeUtils.toggleTaskWithParentChildSync(tasks, selected);
      
      const task = newTasks[selected];
      set({
        tasks: newTasks,
        message: t("messageToggled", { task: task.label }),
      });
      writeTasks(newTasks, get().filePath);
    }
  },

  deleteTask: () => {
    const { tasks, selected } = get();
    if (tasks[selected]) {
      const taskToDelete = tasks[selected];
      
      // 使用任务树工具类删除任务及其子任务
      const newTasks = TaskTreeUtils.deleteTaskWithChildren(tasks, selected);
      
      const newSelected =
        selected >= newTasks.length && newTasks.length > 0
          ? newTasks.length - 1
          : selected;

      set({
        tasks: newTasks,
        selected: newSelected,
        message: t("messageDeleted", { task: taskToDelete.label }),
      });
      writeTasks(newTasks, get().filePath);
    }
  },

  editTask: (newLabel: string) => {
    const { tasks, selected } = get();
    if (tasks[selected] && newLabel) {
      const newTasks = tasks.map((task, i) =>
        i === selected ? { ...task, label: newLabel } : task
      );
      set({
        tasks: newTasks,
        message: t("messageEdited", { task: newLabel }),
      });
      writeTasks(newTasks, get().filePath);
    }
  },

  promoteTask: () => {
    const { tasks, selected, filePath } = get();
    if (!TaskTreeUtils.canPromoteTask(tasks, selected)) {
      set({ message: t("messageCannotPromote") });
      return;
    }

    const newLevel = TaskTreeUtils.calculateNewTaskLevel(tasks, selected, 'up');
    const newTasks = TaskTreeUtils.adjustTaskLevel(tasks, selected, newLevel);
    
    set({
      tasks: newTasks,
      message: t("messageTaskPromoted"),
    });
    writeTasks(newTasks, filePath);
  },

  demoteTask: () => {
    const { tasks, selected, filePath } = get();
    if (!TaskTreeUtils.canDemoteTask(tasks, selected)) {
      set({ message: t("messageCannotDemote") });
      return;
    }

    const newLevel = TaskTreeUtils.calculateNewTaskLevel(tasks, selected, 'down');
    const newTasks = TaskTreeUtils.adjustTaskLevel(tasks, selected, newLevel);
    
    set({
      tasks: newTasks,
      message: t("messageTaskDemoted"),
    });
    writeTasks(newTasks, filePath);
  },
}));
