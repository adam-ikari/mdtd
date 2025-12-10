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
    promoteTask,
    demoteTask,
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
        // 提升层级
        promoteTask();
      } else if (key.rightArrow || input === "l" || input === "L") {
        // 降低层级
        demoteTask();
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
