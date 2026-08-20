import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');

  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const [blockedInput, setBlockedInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const timerError = useRef<NodeJS.Timeout | null>(null);

  const todosCounter = todos.reduce((curr, todo) => {
    return !todo.completed ? curr + 1 : curr;
  }, 0);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const completedAllTodos = () => {
    setTodos(currentTodos => {
      const allCompletedCurrent =
        currentTodos.length > 0 && currentTodos.every(todo => todo.completed);

      return currentTodos.map(todo => {
        const copyTodo = { ...todo };

        copyTodo.completed = !allCompletedCurrent;

        return copyTodo;
      });
    });
  };

  const handleAddTodo = (newTitle: string) => {
    setBlockedInput(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    return addTodo({
      userId: USER_ID,
      title: newTitle,
      completed: false,
    })
      .then(data => {
        setBlockedInput(false);
        setTempTodo(null);

        setTodos(currentTodos => [...currentTodos, data]);

        return true;
      })
      .catch(() => {
        setBlockedInput(false);
        setTempTodo(null);

        setError(ErrorMessage.Add);

        return false;
      });
  };

  function checkedTodoCompleted(id: number, completed: boolean) {
    setError('');

    updateTodo(id, completed)
      .then(data => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === id) {
              return data;
            }

            return todo;
          }),
        );
      })
      .catch(() => setError(ErrorMessage.Update));
  }

  function removeTodo(id: number) {
    setError('');

    setBlockedInput(true);
    setDeletingTodoId(currentIds => [...currentIds, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setBlockedInput(false);
        setDeletingTodoId(currentIds => currentIds.filter(currentId => currentId !== id));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
        setBlockedInput(false);
        setDeletingTodoId(currentIds => currentIds.filter(currentId => currentId !== id));
      });
  }

  async function clearCompleted() {
    setError('');
    setBlockedInput(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const deleteRequests = completedTodos.map(todo => deleteTodo(todo.id));

    setDeletingTodoId(completedTodos.map(todo => todo.id))

    const results = await Promise.allSettled(deleteRequests);

    const successfullyDeletedTodos = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return completedTodos[index];
        }

        return null;
      })
      .filter((todo): todo is Todo => todo !== null);

    setDeletingTodoId(currentIds =>
  currentIds.filter(id => {
    const successfullyDeletedTodoIds = successfullyDeletedTodos.map(
      todo => todo.id,
    );

    return !successfullyDeletedTodoIds.includes(id);
  }),
);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfullyDeletedTodos.includes(todo)),
    );
    setBlockedInput(false);

    const isRejected = results.some(result => result.status === 'rejected');

    if (isRejected) {
      setError(ErrorMessage.Delete);
    }
  }

  useEffect(() => {
    setError('');

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (error === '') {
      return;
    }

    if (timerError.current !== null) {
      clearTimeout(timerError.current);
    }

    timerError.current = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      if (timerError.current === null) {
        return;
      }

      clearTimeout(timerError.current);
    };
  }, [error]);

  return {
    todos,
    error,
    setError,
    allCompleted,
    completedAllTodos,
    todosCounter,
    hasCompletedTodos,
    blockedInput,
    tempTodo,
    deletingTodoId,
    handleAddTodo,
    checkedTodoCompleted,
    removeTodo,
    clearCompleted,
  };
};
