import React, { useEffect, useMemo, useState } from 'react';
import { Errors } from '../../types/Errors';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import { USER_ID } from '../../utils/userId';
import { TodoContext } from '../../types/TodoContext';

export const TodosContext = React.createContext<TodoContext>({
  visibleTodos: [],
  todos: [],
  setTodos: () => { },
  editedTodo: null,
  setEditedTodo: () => { },
  error: null,
  setError: () => { },
  filterStatus: Status.All,
  setFilterStatus: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  deletionId: null,
  setDeletionId: () => { },
});

type Props = {
  children: React.ReactNode,
};

export const GlobalStateProvier: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<Errors | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletionId, setDeletionId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.LoadError));
  }, []);

  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (filterStatus) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      default:
        return true;
    }
  }), [filterStatus, todos]);

  const value: TodoContext = {
    visibleTodos,
    todos,
    setTodos,
    editedTodo,
    setEditedTodo,
    error,
    setError,
    filterStatus,
    setFilterStatus,
    tempTodo,
    setTempTodo,
    deletionId,
    setDeletionId,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
