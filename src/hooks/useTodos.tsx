import { useCallback, useEffect, useState } from 'react';
import {
  createTodo, deleteTodo,
  getTodos, patchTodo,
} from '../api/todos';
// types
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';

const useTodos = (USER_ID: number) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeErrorMessage = useCallback((message: string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      .catch(() => changeErrorMessage(ErrorMessages.DOWNLOAD));
  }, [USER_ID]);

  const addTodo = useCallback((todo: string) => {
    const newTodo = {
      id: 0,
      title: todo,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(data => {
        setTodos(old => old.concat(data));
      })
      .catch(() => changeErrorMessage(ErrorMessages.ADD))
      .finally(() => {
        setTempTodo(null);
      });
  }, [USER_ID, changeErrorMessage]);

  const removeTodo = useCallback((itemId: number) => {
    setLoadingTodoId(prev => [...prev, itemId]);
    deleteTodo(itemId)
      .then(() => setTodos(old => old.filter(todo => todo.id !== itemId)))
      .catch(() => changeErrorMessage(ErrorMessages.DELETE))
      .finally(
        () => setLoadingTodoId(prev => prev.filter(id => id !== itemId)),
      );
  }, []);

  const updateTodo = (itemId: number, completed: boolean) => {
    setLoadingTodoId(prev => [...prev, itemId]);
    patchTodo(itemId, !completed)
      .then(() => setTodos(old => old.map(todo => {
        if (todo.id === itemId) {
          return {
            ...todo,
            completed: !completed,
          };
        }

        return todo;
      })))
      .catch(() => changeErrorMessage(ErrorMessages.UPDATE))
      .finally(
        () => setLoadingTodoId(prev => prev.filter(id => id !== itemId)),
      );
  };

  const removeAllCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  return {
    todos,
    loadingTodoId,
    tempTodo,
    error,
    addTodo,
    removeTodo,
    updateTodo,
    removeAllCompleted,
    changeErrorMessage,
    setError,
  };
};

export default useTodos;
