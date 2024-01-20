import React, { useState, useMemo } from 'react';
import * as todoService from '../service/todo';
import { Error } from '../types/Error';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  children: React.ReactNode
};

interface Context {
  todos: Todo[],
  status: Status,
  errorMessage: Error,
  tempTodo: Todo | null,
  loadingIds: number[],
  handleTodo: ({ title, userId, completed }: Omit<Todo, 'id'>) => void,
  handleCompleted: (todoId: number) => void,
  handleAllCompleted: () => void,
  handleDeleteCompleted: () => void,
  handleStatus: (newStatus: Status) => void,
  handleUpdateTodo: (changeId: number, updateTitle: string) => void,
  handleDeleteTodo: (deleteId: number) => void
  handleApiTodos: (response: Todo[]) => void
  handleErrorMessage: (error: Error) => void
}

export const TodosContext = React.createContext<Context>({
  todos: [],
  status: Status.All,
  errorMessage: Error.None,
  tempTodo: null,
  loadingIds: [],
  handleTodo: () => { },
  handleCompleted: () => { },
  handleDeleteCompleted: () => { },
  handleStatus: () => { },
  handleAllCompleted: () => { },
  handleUpdateTodo: () => { },
  handleDeleteTodo: () => { },
  handleApiTodos: () => { },
  handleErrorMessage: () => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleErrorMessage = (error: Error) => {
    setErrorMessage(error);
  };

  const handleApiTodos = (response: Todo[]) => {
    setTodos(response);
  };

  const handleDeleteCompleted = () => {
    const deleteAllCompleted = todos.filter(todo => !todo.completed);

    setTodos(deleteAllCompleted);
  };

  const handleCompleted = (todoId: number) => {
    setTodos(todos.map(todo => (todo.id === todoId
      ? { ...todo, completed: !todo.completed }
      : todo)));
  };

  const handleAllCompleted = () => {
    const statusCompleted = todos.some(todo => !todo.completed);

    if (statusCompleted) {
      setTodos(todos.map(todo => (todo.completed === false
        ? { ...todo, completed: !todo.completed }
        : todo)));
    } else {
      setTodos(todos.map(
        todo => ({ ...todo, completed: !todo.completed }),
      ));
    }
  };

  const handleTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setTempTodo({
      id: 0,
      userId,
      title,
      completed,
    });

    return todoService.createTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(
          [
            ...todos,
            newTodo,
          ],
        );
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleUpdateTodo = (changeId: number, updateTitle: string) => {
    setTodos(todos.map(todo => (todo.id === changeId
      ? { ...todo, title: updateTitle }
      : todo)));
  };

  const handleDeleteTodo = (deleteId: number) => {
    setLoadingIds(state => [
      ...state,
      deleteId,
    ]);

    todoService.deleteTodos(`/todos/${deleteId}`)
      .then(() => {
        const filteredTodos = todos.filter(todo => todo.id !== deleteId);

        setTodos(filteredTodos);
      })
      .finally(() => {
        setLoadingIds([]);
      });
  };

  const handleStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const value = useMemo(() => ({
    todos,
    status,
    errorMessage,
    tempTodo,
    loadingIds,
    handleTodo,
    handleCompleted,
    handleDeleteCompleted,
    handleStatus,
    handleAllCompleted,
    handleUpdateTodo,
    handleDeleteTodo,
    handleApiTodos,
    handleErrorMessage,
  }), [todos, status, errorMessage, tempTodo, loadingIds]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
