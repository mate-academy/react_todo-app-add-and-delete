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
  isFieldDisabled: boolean,
  handleTodoAdd: ({ title, userId, completed }: Omit<Todo, 'id'>) => void,
  toggleTodoStatus: (todoId: number) => void,
  toggleAll: () => void,
  handleDeleteCompleted: () => void,
  handleStatus: (newStatus: Status) => void,
  handleUpdateTodo: (changeId: number, updateTitle: string) => void,
  handleDeleteTodo: (deleteId: number) => void,
  handleErrorMessage: (error: Error) => void,
  handleDisabled: (disable: boolean) => void,
  setTodos: (response: Todo[]) => void,
}

export const TodosContext = React.createContext<Context>({
  todos: [],
  status: Status.All,
  errorMessage: Error.None,
  tempTodo: null,
  loadingIds: [],
  isFieldDisabled: false,
  handleTodoAdd: () => { },
  toggleTodoStatus: () => { },
  handleDeleteCompleted: () => { },
  handleStatus: () => { },
  toggleAll: () => { },
  handleUpdateTodo: () => { },
  handleDeleteTodo: () => { },
  handleErrorMessage: () => { },
  handleDisabled: () => { },
  setTodos: () => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [isFieldDisabled, setIsFieldDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleDisabled = (disable: boolean) => {
    setIsFieldDisabled(disable);
  };

  const handleErrorMessage = (error: Error) => {
    setErrorMessage(error);
  };

  const handleDeleteCompleted = async () => {
    const allCompleted = todos.filter(todo => todo.completed);
    const completedIds = allCompleted.map(todo => todo.id);

    setLoadingIds(state => [
      ...state,
      ...completedIds,
    ]);

    try {
      handleDisabled(true);
      await Promise.all(completedIds.map(id => {
        return todoService.deleteTodos(`/todos/${id}`);
      }));
      setTodos(prev => prev.filter(todo => !completedIds.includes(todo.id)));
    } catch {
      setErrorMessage(Error.Delete);
    } finally {
      setLoadingIds([]);
      handleDisabled(false);
    }
  };

  const toggleTodoStatus = (todoId: number) => {
    setTodos(state => state.map(todo => (todo.id === todoId
      ? { ...todo, completed: !todo.completed }
      : todo)));
  };

  const toggleAll = () => {
    const isSomeTodoCompleted = todos.some(todo => !todo.completed);

    if (isSomeTodoCompleted) {
      setTodos(state => state.map(todo => (todo.completed === false
        ? { ...todo, completed: !todo.completed }
        : todo)));
    } else {
      setTodos(state => state.map(
        todo => ({ ...todo, completed: !todo.completed }),
      ));
    }
  };

  const handleTodoAdd = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
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

        setErrorMessage(Error.None);
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsFieldDisabled(false);
      });
  };

  const handleUpdateTodo = (changeId: number, updateTitle: string) => {
    setTodos(state => state.map(todo => (todo.id === changeId
      ? { ...todo, title: updateTitle }
      : todo)));
  };

  const handleDeleteTodo = (deleteId: number) => {
    handleDisabled(true);

    setLoadingIds(state => [
      ...state,
      deleteId,
    ]);

    return todoService.deleteTodos(`/todos/${deleteId}`)
      .then(() => {
        setTodos(state => state.filter(todo => todo.id !== deleteId));
      })
      .catch(() => {
        setErrorMessage(Error.Delete);
      })
      .finally(() => {
        setLoadingIds([]);
        handleDisabled(false);
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
    isFieldDisabled,
    handleTodoAdd,
    toggleTodoStatus,
    handleDeleteCompleted,
    handleStatus,
    toggleAll,
    handleUpdateTodo,
    handleDeleteTodo,
    handleErrorMessage,
    handleDisabled,
    setTodos,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [todos, status, errorMessage, tempTodo, loadingIds, isFieldDisabled]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
