import { Task } from "./fileManager";

export interface TaskWithLevel extends Task {
  level: number;
}

/**
 * 任务树操作工具类
 */
export class TaskTreeUtils {
  /**
   * 获取任务的所有子任务（包括嵌套的子任务）
   * @param tasks 任务列表
   * @param parentIndex 父任务索引
   * @returns 子任务索引数组
   */
  static getChildTaskIndices(tasks: TaskWithLevel[], parentIndex: number): number[] {
    const parentLevel = tasks[parentIndex].level;
    const childIndices: number[] = [];
    
    // 从父任务的下一个任务开始查找
    for (let i = parentIndex + 1; i < tasks.length; i++) {
      const currentLevel = tasks[i].level;
      
      // 如果当前任务的层级小于或等于父任务的层级，说明已超出子任务范围
      if (currentLevel <= parentLevel) {
        break;
      }
      
      // 否则，这是一个子任务或子任务的子任务
      childIndices.push(i);
    }
    
    return childIndices;
  }

  /**
   * 获取任务的直接子任务（不包括嵌套的子任务）
   * @param tasks 任务列表
   * @param parentIndex 父任务索引
   * @returns 直接子任务索引数组
   */
  static getDirectChildTaskIndices(tasks: TaskWithLevel[], parentIndex: number): number[] {
    const parentLevel = tasks[parentIndex].level;
    const childIndices: number[] = [];
    
    // 从父任务的下一个任务开始查找
    for (let i = parentIndex + 1; i < tasks.length; i++) {
      const currentLevel = tasks[i].level;
      
      // 如果当前任务的层级小于或等于父任务的层级，说明已超出子任务范围
      if (currentLevel <= parentLevel) {
        break;
      }
      
      // 如果当前任务的层级等于父任务的层级+1，这是直接子任务
      if (currentLevel === parentLevel + 1) {
        childIndices.push(i);
      }
    }
    
    return childIndices;
  }

  /**
   * 获取任务的父任务索引
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @returns 父任务索引，如果没有则返回-1
   */
  static getParentTaskIndex(tasks: TaskWithLevel[], taskIndex: number): number {
    const currentLevel = tasks[taskIndex].level;
    
    // 从当前任务的前一个任务开始向上查找
    for (let i = taskIndex - 1; i >= 0; i--) {
      const taskLevel = tasks[i].level;
      
      // 找到第一个层级小于当前任务的任务，这就是父任务
      if (taskLevel < currentLevel) {
        return i;
      }
    }
    
    // 没有找到父任务
    return -1;
  }

  /**
   * 获取任务的根任务索引（同一层级链上的顶级任务）
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @returns 根任务索引
   */
  static getRootTaskIndex(tasks: TaskWithLevel[], taskIndex: number): number {
    let currentIndex = taskIndex;
    let parentIndex = this.getParentTaskIndex(tasks, currentIndex);
    
    // 循环向上查找父任务，直到找到顶级任务
    while (parentIndex !== -1) {
      currentIndex = parentIndex;
      parentIndex = this.getParentTaskIndex(tasks, currentIndex);
    }
    
    return currentIndex;
  }

  /**
   * 调整任务及其所有子任务的层级
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @param newLevel 新层级
   * @returns 调整后的任务列表
   */
  static adjustTaskLevel(tasks: TaskWithLevel[], taskIndex: number, newLevel: number): TaskWithLevel[] {
    const originalLevel = tasks[taskIndex].level;
    const levelDiff = newLevel - originalLevel;
    
    // 创建新的任务列表
    const newTasks = [...tasks];
    
    // 调整选中任务的层级
    newTasks[taskIndex] = {
      ...newTasks[taskIndex],
      level: newLevel
    };
    
    // 获取所有子任务并调整它们的层级
    const childIndices = this.getChildTaskIndices(tasks, taskIndex);
    childIndices.forEach(childIndex => {
      newTasks[childIndex] = {
        ...newTasks[childIndex],
        level: newTasks[childIndex].level + levelDiff
      };
    });
    
    return newTasks;
  }

  /**
   * 移动任务及其所有子任务到新位置
   * @param tasks 任务列表
   * @param taskIndex 要移动的任务索引
   * @param targetIndex 目标位置索引
   * @returns 移动后的任务列表
   */
  static moveTaskWithChildren(tasks: TaskWithLevel[], taskIndex: number, targetIndex: number): TaskWithLevel[] {
    // 获取要移动的任务及其子任务
    const childIndices = this.getChildTaskIndices(tasks, taskIndex);
    const tasksToMove = [taskIndex, ...childIndices].map(index => tasks[index]);
    
    // 从原列表中移除这些任务
    const remainingTasks = tasks.filter((_, index) => !tasksToMove.includes(tasks[index]));
    
    // 计算在剩余任务中的新位置
    const adjustedTargetIndex = Math.min(targetIndex, remainingTasks.length);
    
    // 在新位置插入任务
    const newTasks = [
      ...remainingTasks.slice(0, adjustedTargetIndex),
      ...tasksToMove,
      ...remainingTasks.slice(adjustedTargetIndex)
    ];
    
    return newTasks;
  }

  /**
   * 删除任务及其所有子任务
   * @param tasks 任务列表
   * @param taskIndex 要删除的任务索引
   * @returns 删除后的任务列表
   */
  static deleteTaskWithChildren(tasks: TaskWithLevel[], taskIndex: number): TaskWithLevel[] {
    // 获取要删除的任务及其子任务
    const childIndices = this.getChildTaskIndices(tasks, taskIndex);
    const indicesToDelete = [taskIndex, ...childIndices];
    
    // 过滤掉要删除的任务
    const newTasks = tasks.filter((_, index) => !indicesToDelete.includes(index));
    
    return newTasks;
  }

  /**
   * 更新父任务的完成状态
   * @param tasks 任务列表
   * @param parentIndex 父任务索引
   * @returns 更新后的任务列表
   */
  static updateParentCompletedStatus(tasks: TaskWithLevel[], parentIndex: number): TaskWithLevel[] {
    const parentLevel = tasks[parentIndex].level;
    const directChildIndices = this.getDirectChildTaskIndices(tasks, parentIndex);
    
    // 如果没有子任务，直接返回
    if (directChildIndices.length === 0) {
      return tasks;
    }
    
    // 检查所有子任务是否完成
    const allChildrenCompleted = directChildIndices.every(index => tasks[index].completed);
    
    // 更新父任务的完成状态
    const newTasks = [...tasks];
    newTasks[parentIndex] = {
      ...newTasks[parentIndex],
      completed: allChildrenCompleted
    };
    
    return newTasks;
  }

  /**
   * 递归更新所有父任务的完成状态
   * @param tasks 任务列表
   * @param taskIndex 子任务索引
   * @returns 更新后的任务列表
   */
  static updateAllParentCompletedStatus(tasks: TaskWithLevel[], taskIndex: number): TaskWithLevel[] {
    let newTasks = [...tasks];
    let parentIndex = this.getParentTaskIndex(newTasks, taskIndex);
    
    // 循环向上更新所有父任务
    while (parentIndex !== -1) {
      newTasks = this.updateParentCompletedStatus(newTasks, parentIndex);
      parentIndex = this.getParentTaskIndex(newTasks, parentIndex);
    }
    
    return newTasks;
  }

  /**
   * 切换任务完成状态并处理父子关系
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @returns 更新后的任务列表
   */
  static toggleTaskWithParentChildSync(tasks: TaskWithLevel[], taskIndex: number): TaskWithLevel[] {
    const task = tasks[taskIndex];
    const newCompletedStatus = !task.completed;
    
    // 创建新的任务列表
    let newTasks = [...tasks];
    
    // 更新选中任务的状态
    newTasks[taskIndex] = {
      ...newTasks[taskIndex],
      completed: newCompletedStatus
    };
    
    // 获取所有子任务
    const childIndices = this.getChildTaskIndices(tasks, taskIndex);
    
    // 如果任务被标记为完成，则将所有子任务也标记为完成
    if (newCompletedStatus) {
      childIndices.forEach(childIndex => {
        newTasks[childIndex] = {
          ...newTasks[childIndex],
          completed: true
        };
      });
    } else {
      // 如果任务被标记为未完成，则将所有子任务也标记为未完成
      childIndices.forEach(childIndex => {
        newTasks[childIndex] = {
          ...newTasks[childIndex],
          completed: false
        };
      });
    }
    
    // 更新所有父任务的完成状态
    newTasks = this.updateAllParentCompletedStatus(newTasks, taskIndex);
    
    return newTasks;
  }

  /**
   * 检查是否可以将任务移动到目标位置
   * @param tasks 任务列表
   * @param taskIndex 要移动的任务索引
   * @param targetIndex 目标位置索引
   * @returns 是否可以移动
   */
  static canMoveTaskToPosition(tasks: TaskWithLevel[], taskIndex: number, targetIndex: number): boolean {
    // 不能移动到自己的位置
    if (taskIndex === targetIndex) {
      return false;
    }
    
    // 不能移动到自己的子任务位置
    const childIndices = this.getChildTaskIndices(tasks, taskIndex);
    if (childIndices.includes(targetIndex)) {
      return false;
    }
    
    // 不能将任务移动到其子任务内部
    for (let i = taskIndex + 1; i < tasks.length; i++) {
      if (tasks[i].level <= tasks[taskIndex].level) {
        break;
      }
      
      if (targetIndex >= taskIndex + 1 && targetIndex <= i) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 检查是否可以提升任务层级
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @returns 是否可以提升
   */
  static canPromoteTask(tasks: TaskWithLevel[], taskIndex: number): boolean {
    const parentIndex = this.getParentTaskIndex(tasks, taskIndex);
    return parentIndex !== -1;
  }

  /**
   * 检查是否可以降低任务层级
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @returns 是否可以降低
   */
  static canDemoteTask(tasks: TaskWithLevel[], taskIndex: number): boolean {
    // 第一个任务不能降低层级
    if (taskIndex === 0) {
      return false;
    }
    
    // 只要不是第一个任务，总是可以降低层级
    // 因为可以成为前一个任务的子任务
    return true;
  }

  /**
   * 计算任务的新层级
   * @param tasks 任务列表
   * @param taskIndex 任务索引
   * @param direction 方向：'up'为提升，'down'为降低
   * @returns 新层级
   */
  static calculateNewTaskLevel(tasks: TaskWithLevel[], taskIndex: number, direction: 'up' | 'down'): number {
    const currentLevel = tasks[taskIndex].level;
    
    if (direction === 'up') {
      // 提升层级：找到父任务的层级
      const parentIndex = this.getParentTaskIndex(tasks, taskIndex);
      return parentIndex !== -1 ? tasks[parentIndex].level : currentLevel;
    } else {
      // 降低层级：成为前一个任务的子任务
      if (taskIndex === 0) {
        return currentLevel; // 第一个任务不能降低层级
      }
      
      const prevTaskLevel = tasks[taskIndex - 1].level;
      
      // 降级时，新层级应该是前一个任务的层级+1
      // 但要确保不会超过当前层级+1（避免层级跳跃过大）
      const targetLevel = prevTaskLevel + 1;
      
      // 如果目标层级大于当前层级+1，则只降低一级
      if (targetLevel > currentLevel + 1) {
        return currentLevel + 1;
      }
      
      return targetLevel;
    }
  }
}