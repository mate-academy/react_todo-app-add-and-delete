import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, postTodo } from '../api/todos';

type SelectedFilter = 'all' | 'active' | 'completed';

type TodoContext = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  error: string | null,
  handleCloseError: () => void;
  setNewTodoTitle: (newTodoTitle: string) => void;
  newTodoTitle: string;
  setError: (errorName: string) => void;
  handleSelectFilter: (filterType: SelectedFilter) => void;
  selectedFilter: SelectedFilter;
  handleError: (errorName: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  USER_ID: number;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  disabledInput: boolean;
  setDisabledInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => { },
  error: null,
  handleCloseError: () => { },
  setNewTodoTitle: () => '',
  newTodoTitle: '',
  setError: () => null,
  handleError: () => null,
  handleSelectFilter: () => { },
  selectedFilter: 'all',
  addTodo: () => { },
  USER_ID: 0,
  deleteTodo: () => { },
  tempTodo: {
    id: 0, userId: 0, title: '', completed: false,
  },
  setTempTodo: () => { },
  disabledInput: false,
  setDisabledInput: () => { },
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const USER_ID = 11526;

  const handleError = (errorName: string) => {
    setError(errorName);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    // const { id, ...rest } = todo;

    setTempTodo({ ...todo, id: 0 });
    postTodo(USER_ID, todo)
      .then((resp) => {
        setTodos(currentTodos => [resp, ...currentTodos]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setDisabledInput(false);
      });
    // postTodo(USER_ID, rest);
    // setTodos(currentTodos => [todo, ...currentTodos]);
    // handleError('Unable to add a todo');
    // setTempTodo(null);
    // setNewTodoTitle('');
    // setDisabledInput(false);
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const handleSelectFilter = (filterType: SelectedFilter) => {
    setSelectedFilter(filterType);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));
  }, []);

  return (
    <TodosContext.Provider value={{
      todos,
      error,
      setError,
      handleCloseError,
      setNewTodoTitle,
      newTodoTitle,
      handleSelectFilter,
      selectedFilter,
      handleError,
      addTodo,
      USER_ID,
      deleteTodo,
      tempTodo,
      setTempTodo,
      disabledInput,
      setDisabledInput,
      setTodos,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
