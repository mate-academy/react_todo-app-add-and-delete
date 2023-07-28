import React, {
  PropsWithChildren, useEffect, useMemo, useState,
} from 'react';
import { Todo, TodoListFilterStatus } from '../types/Todo';
import { createTodo, deleteTodo, getTodos } from '../api/todos';
import {
  getFilteredTodos, getTodosStatistics, ITodosStatistics,
} from '../services/todo.service';
import { ErrorValues } from '../types/Error';

const USER_ID = 11215;

interface ITodoContext {
  todos: Todo[],
  handleTodoListFilterStatus: (status: TodoListFilterStatus) => void,
  todoListFilterStatus: TodoListFilterStatus,
  todosStatistics: ITodosStatistics,
  error: ErrorValues | null,
  handleError: (value: ErrorValues | null) => void,
  addNewTodo: (title: string) => void,
  loadingTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  selectedTodoIds: number[],
  removeCompletedTodos: () => void,
}

export const TodoContext
  = React.createContext<ITodoContext>({} as ITodoContext);

export const TodoProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todoListFilterStatus, setTodoListFilerStatus]
    = useState<TodoListFilterStatus>(TodoListFilterStatus.All);
  const [error, setError] = useState<ErrorValues | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => setError(ErrorValues.RequestError));
  }, []);

  const todos = useMemo(() => {
    return getFilteredTodos(
      todosFromServer, { filterStatus: todoListFilterStatus },
    );
  }, [todosFromServer, todoListFilterStatus]);

  const handleTodoListFilterStatus = (status: TodoListFilterStatus) => {
    setTodoListFilerStatus(status);
  };

  const todosStatistics = useMemo(() => {
    return getTodosStatistics(todosFromServer);
  }, [todosFromServer]);

  const handleError = (value: ErrorValues | null) => {
    setError(value);
  };

  const addNewTodo = (title: string) => {
    const newTodo:Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    if (!title) {
      setError(ErrorValues.EmptyTitleError);

      return;
    }

    setLoadingTodo(newTodo);

    createTodo(USER_ID, newTodo)
      .then(createdTodo => {
        setTodosFromServer(
          currentTodos => [...currentTodos, createdTodo],
        );

        return createdTodo;
      })
      .finally(() => setLoadingTodo(null));
  };

  const removeTodo = (todoId: number) => {
    setSelectedTodoIds([todoId]);

    deleteTodo(todoId)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .finally(() => setSelectedTodoIds([]));
  };

  const removeCompletedTodos = () => {
    const completedTodosIds = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setSelectedTodoIds(completedTodosIds);

    const needToRemovedTodos = completedTodosIds
      .map(id => deleteTodo(id));

    Promise.all(needToRemovedTodos)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.filter(
          todo => !todo.completed,
        ),
      ))
      .finally(() => setSelectedTodoIds([]));
  };

  return (
    <TodoContext.Provider value={{
      todos,
      handleTodoListFilterStatus,
      todoListFilterStatus,
      todosStatistics,
      error,
      handleError,
      addNewTodo,
      loadingTodo,
      removeTodo,
      selectedTodoIds,
      removeCompletedTodos,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};
