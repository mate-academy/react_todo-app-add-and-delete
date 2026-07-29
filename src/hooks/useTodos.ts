import { useCallback, useState } from 'react';

import { getTodos, removeTodo as removeTodoApi } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorsEnum } from '../enums/ErrorMessage';
import {
  optimisticDeleteTodo,
  restoreTodo,
  Rollback,
} from '../utils/todoState';

type UseTodosOptions = {
  onError: (message: string) => void;
  onClearError: () => void;
};

export const useTodos = ({ onError, onClearError }: UseTodosOptions) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const loadTodos = useCallback(() => {
    onClearError();

    getTodos()
      .then(setTodos)
      .catch(() => {
        onError(ErrorsEnum.LOAD);
      });
  }, [onError, onClearError]);

  const addTodo = useCallback((todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  }, []);

  const removeTodo = useCallback(
    (todoId: number, isOptimistic = false) => {
      onClearError();

      if (isOptimistic) {
        let rollback: Rollback | null = null;

        setTodos(prev => {
          const result = optimisticDeleteTodo(prev, todoId);

          if (!result) {
            return prev;
          }

          rollback = result.rollback;

          return result.todos;
        });

        return removeTodoApi(todoId).catch(() => {
          onError(ErrorsEnum.DELETE);

          if (!rollback) {
            return;
          }

          const rollbackToApply = rollback;

          setTodos(prev => restoreTodo(prev, rollbackToApply));
        });
      }

      setLoadingTodoIds(prev => [...prev, todoId]);

      return removeTodoApi(todoId)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          onError(ErrorsEnum.DELETE);
        })
        .finally(() => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        });
    },
    [onError, onClearError],
  );

  return {
    todos,
    loadingTodoIds,
    loadTodos,
    addTodo,
    removeTodo,
  };
};
