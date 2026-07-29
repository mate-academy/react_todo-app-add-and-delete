import { Todo } from '../types/Todo';

export type Rollback = {
  todo: Todo;
  deletedIndex: number;
};

type OptimisticDeleteResult = {
  todos: Todo[];
  rollback: Rollback;
};

export const restoreTodo = (todos: Todo[], rollback: Rollback): Todo[] => {
  if (todos.some(todo => todo.id === rollback.todo.id)) {
    return todos;
  }

  const updated = [...todos];

  updated.splice(rollback.deletedIndex, 0, rollback.todo);

  return updated;
};

export const optimisticDeleteTodo = (
  todos: Todo[],
  todoId: number,
): OptimisticDeleteResult | null => {
  const deletedIndex = todos.findIndex(todo => todo.id === todoId);

  if (deletedIndex === -1) {
    return null;
  }

  const todo = todos[deletedIndex];

  return {
    todos: todos.filter(item => item.id !== todoId),

    rollback: {
      todo,
      deletedIndex,
    },
  };
};
