import React from 'react';
import { useEffect, useState } from 'react';

import { TodoType } from '../types/TodoType';
import * as clientService from '../api/todos';
import { TodoListContext } from './TodoListContext';

import { Filters } from '../types/Filters';
import { ERRORS } from '../constants/constants';
import { TodoListProviderType } from '../types/TodoListProviderType';

export const TodoListProvider: React.FC<TodoListProviderType> = ({
  children,
}) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>(Filters.All);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);

  useEffect(() => {
    const errorMessagePoint = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(errorMessagePoint);
  }, [errorMessage]);

  useEffect(() => {
    clientService
      .getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ERRORS.LOAD);
      });
  }, []);

  const saveTempTodo = (todo: string) => {
    setTempTodo({
      id: 0,
      userId: clientService.USER_ID,
      title: todo,
      completed: false,
    });
  };

  const addTodo = (todo: string) => {
    if (!todo.trim()) {
      setErrorMessage(ERRORS.EMPTY_TODO);

      return;
    }

    if (!errorMessage) {
      saveTempTodo(todo);
    }

    clientService
      .postTodo({
        title: todo,
        completed: false,
        userId: clientService.USER_ID,
      })
      .then(data => {
        setTodos([...todos, data]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ERRORS.ADD_TODO);
      });
  };

  const deleteTodo = (id: number) => {
    clientService
      .deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ERRORS.DELETE_TODO);
      });
  };

  const clearCompletedTodo = async () => {
    const result = todos.filter(item => !item.completed);

    await Promise.all(
      todos.map(async todo => {
        setTodos(result);
        await clientService.deleteTodo(todo.id);
      }),
    ).catch(() => {
      setErrorMessage(ERRORS.DELETE_TODO);
    });
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const getValue = () => {
    return {
      todos,
      errorMessage,
      currentFilter,
      setCurrentFilter,
      addTodo,
      deleteTodo,
      clearErrorMessage,
      clearCompletedTodo,
      tempTodo,
    };
  };

  return (
    <TodoListContext.Provider value={getValue()}>
      {children}
    </TodoListContext.Provider>
  );
};
