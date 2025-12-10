import React from "react";
import { Text, Box, Newline, useInput, useApp } from "ink";
import { useTaskStore } from "@/store/taskStore.ts";
import { Task, writeTasks } from "@/services/fileManager.ts";
import InputBox from "@/components/InputBox.tsx";
import { t } from "@/services/i18n.ts";

export default function App() {
  const { exit } = useApp();
  const {
    mode,
    message,
    tasks,
    selected,
    inputValue,
    clearMessage,
    setMode,
    setInputValue,
    moveUp,
    moveDown,
    moveTaskUp,
    moveTaskDown,
    addTask,
    toggleTask,
    deleteTask,
  } = useTaskStore();

  useInput((input, key) => {
    if (message) clearMessage();

    if (mode === "add" || mode === "edit") {
      if (key.return) {
        addTask();
      } else if (key.backspace || key.delete) {
        setInputValue(inputValue.slice(0, -1));
      } else {
        setInputValue(inputValue + input);
      }
      return;
    }

    if (mode === "list") {
      if (key.shift && (key.downArrow || input === "j" || input === "J")) {
        moveTaskDown();
      } else if (key.shift && (key.upArrow || input === "k" || input === "K")) {
        moveTaskUp();
      } else if (key.leftArrow || input === "h" || input === "H") {
        // 提升层级到父任务同级
        const { tasks, selected, filePath } = useTaskStore.getState();
        const currentLevel = tasks[selected]?.level || 0;

        // 查找最近的父任务
        let parentLevel = -1;
        let parentIndex = -1;
        for (let i = selected - 1; i >= 0; i--) {
          if ((tasks[i].level || 0) < currentLevel) {
            parentLevel = tasks[i].level || 0;
            parentIndex = i;
            break;
          }
        }

        if (parentLevel >= 0) {
          // 计算层级差值
          const levelDiff = parentLevel - currentLevel;
          
          // 找到所有子任务并更新层级
          const newTasks = tasks.map((task: Task & { level?: number }, i: number) => {
            if (i === selected) {
              // 更新选中任务的层级
              return { ...task, level: parentLevel };
            } else if (i > selected) {
              // 检查是否是选中任务的子任务
              const taskLevel = task.level || 0;
              const prevTaskLevel = i > 0 ? (tasks[i - 1]?.level || 0) : 0;
              
              // 如果当前任务在选中任务之后，并且其层级比选中任务的原始层级更深，
              // 则需要调整其层级
              if (taskLevel > currentLevel) {
                // 检查是否在选中任务的子树范围内
                let isChildOfSelected = false;
                let j = selected + 1;
                while (j < i && j < tasks.length) {
                  if ((tasks[j].level || 0) <= currentLevel) {
                    // 遇到了与选中任务同级或更高级别的任务，说明已超出子树范围
                    break;
                  }
                  j++;
                }
                
                if (j > selected && j <= i) {
                  // 是选中任务的子任务，需要调整层级
                  return { ...task, level: taskLevel + levelDiff };
                }
              }
            }
            return task;
          });
          
          useTaskStore.setState({ tasks: newTasks });
          writeTasks(newTasks, filePath);
        } else {
          useTaskStore.setState({
            message: t("messageCannotPromote"),
          });
        }
      } else if (key.rightArrow || input === "l" || input === "L") {
        // 降低层级
        const { tasks, selected, filePath } = useTaskStore.getState();
        const currentLevel = tasks[selected]?.level || 0;
        if (selected > 0) {
          // 确保不是第一个任务
          const prevLevel = tasks[selected - 1]?.level || 0;
          let newLevel = currentLevel;

          if (currentLevel === 0) {
            // 顶级任务降级
            newLevel = prevLevel + 1; // 成为上一行任务的子任务
          } else {
            // 非顶级任务降级
            newLevel = prevLevel < currentLevel ? prevLevel : currentLevel - 1;
          }

          // 计算层级差值
          const levelDiff = newLevel - currentLevel;
          
          // 找到所有子任务并更新层级
          const newTasks = tasks.map((task: Task & { level?: number }, i: number) => {
            if (i === selected) {
              // 更新选中任务的层级
              return { ...task, level: newLevel };
            } else if (i > selected) {
              // 检查是否是选中任务的子任务
              const taskLevel = task.level || 0;
              
              // 如果当前任务在选中任务之后，并且其层级比选中任务的原始层级更深，
              // 则需要调整其层级
              if (taskLevel > currentLevel) {
                // 检查是否在选中任务的子树范围内
                let isChildOfSelected = false;
                let j = selected + 1;
                while (j < i && j < tasks.length) {
                  if ((tasks[j].level || 0) <= currentLevel) {
                    // 遇到了与选中任务同级或更高级别的任务，说明已超出子树范围
                    break;
                  }
                  j++;
                }
                
                if (j > selected && j <= i) {
                  // 是选中任务的子任务，需要调整层级
                  return { ...task, level: taskLevel + levelDiff };
                }
              }
            }
            return task;
          });
          
          useTaskStore.setState({ tasks: newTasks });
          writeTasks(newTasks, filePath);
        } else {
          useTaskStore.setState({
            message: t("messageCannotDemote"),
          });
        }
      } else if (key.downArrow || input === "j" || input === "J") {
        moveDown();
      } else if (key.upArrow || input === "k" || input === "K") {
        moveUp();
      } else {
        switch (input) {
          case "q":
          case "Q":
            exit();
            return;
          case " ":
            toggleTask();
            break;
          case "d":
          case "D":
            deleteTask();
            break;
          case "a":
          case "A":
            setMode("add");
            break;
          case "e":
          case "E":
            if (tasks[selected]) {
              setInputValue(tasks[selected].label);
              setMode("edit");
            }
            break;
        }
      }
    }
  });

  if (mode === "loading") {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="blue" bold>{t("appTitle")}</Text>
        <Newline />
        <Text color="gray">Loading tasks...</Text>
      </Box>
    );
  }

  if (mode === "error") {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red" bold>{t("appTitle")}</Text>
        <Newline />
        <Text color="red">{message}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>{t("appTitle")}</Text>
      <Newline />

      {tasks.length === 0 && mode === "list" ? (
        <Text color="gray" italic>{t("noTasks")}</Text>
      ) : (
        tasks.map((task: Task & { level?: number }, index: number) => (
          <Box key={index} marginLeft={task.level || 0}>
            <Text color={selected === index ? "cyan" : task.completed ? "gray" : "white"}>
              {selected === index ? "▶ " : "  "}
              [{task.completed ? "x" : " "}]{" "}
              <Text strikethrough={task.completed}>
                {task.label}
              </Text>
            </Text>
          </Box>
        ))
      )}

      <Newline />

      {(mode === "add" || mode === "edit") && (
        <Box>
          <Text color="green">
            {mode === "add"
              ? t("addTaskPrompt", { inputValue: "" })
              : t("editTaskPrompt", { inputValue: "" })}
          </Text>
          <Newline />
          <InputBox inputValue={inputValue} />
        </Box>
      )}

      {message && (
        <Box marginTop={1}>
          <Text color="green">{message}</Text>
        </Box>
      )}

      <Box marginTop={1} borderStyle="round" paddingX={1}>
        <Text color="gray">
          {mode === "list" ? t("controlsList") : t("controlsAdd")}
        </Text>
      </Box>
    </Box>
  );
}
