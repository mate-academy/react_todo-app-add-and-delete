import React, { useEffect, useState } from 'react';
import { getTodos } from '../api/todos';
import { FilterBy, Todo } from '../types/Todo';

const USER_ID = 11144;

interface Todos {
  USER_ID: number;
  todos: Todo[];
  tempTodo: Todo | null;
  filterBy: FilterBy;
  errorMessage: string;
  onAddTodo: (newTodo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  setFilterBy: (filter: FilterBy) => void;
  setErrorMessage: (error: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  deletingCompletedTodo: boolean;
  setDeletingCompletedTodo: (value: boolean) => void;
}

export const TodosContext = React.createContext<Todos>({
  USER_ID,
  todos: [],
  tempTodo: null,
  filterBy: FilterBy.ALL,
  errorMessage: '',
  deletingCompletedTodo: false,
  onAddTodo: () => {},
  onDeleteTodo: () => {},
  setFilterBy: () => {},
  setErrorMessage: () => {},
  setTempTodo: () => {},
  setDeletingCompletedTodo: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingCompletedTodo, setDeletingCompletedTodo] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Can not load data');
      });
  }, []);

  function onAddTodo(newTodo: Todo) {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  }

  function onDeleteTodo(todoId: number) {
    setTodos(currentTodos => currentTodos.filter(
      todo => todo.id !== todoId,
    ));
  }

  const todosValues = {
    USER_ID,
    todos,
    tempTodo,
    filterBy,
    errorMessage,
    deletingCompletedTodo,
    onAddTodo,
    onDeleteTodo,
    setFilterBy,
    setErrorMessage,
    setTempTodo,
    setDeletingCompletedTodo,
  };

  return (
    <TodosContext.Provider value={todosValues}>
      {children}
    </TodosContext.Provider>
  );
};
