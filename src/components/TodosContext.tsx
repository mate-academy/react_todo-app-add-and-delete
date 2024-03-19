import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { delTodo, getTodos } from '../api/todos';

type Context = {
  todos: Todo[];
  filteredTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: string;
  setFilter: (v: string) => void;
  toggleAll: () => void;
  addTodoToState: (t: Todo) => void;
  delTodoFromState: (n: number) => void;
  handleDeleteCompleted: () => void;
  errorMessage: string;
  setErrorMessage: (m: string) => void;
  setError: (m: string) => void;
  titleField: RefObject<HTMLInputElement> | null;
  delTodoFromServer: (n: number) => void;
};

export const TodosContext = React.createContext<Context>({
  todos: [],
  filteredTodos: [],
  setTodos: () => {},
  filter: Filter.ALL,
  setFilter: () => {},
  toggleAll: () => {},
  addTodoToState: () => {},
  delTodoFromState: () => {},
  handleDeleteCompleted: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  setError: () => {},
  titleField: null,
  delTodoFromServer: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const titleField = useRef<HTMLInputElement | null>(null);

  const setError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const addTodoToState = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const delTodoFromState = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(elem => elem.id !== todoId));
  };

  const delTodoFromServer = (todoId: number) => {
    setErrorMessage('');

    delTodo(todoId)
      .then(() => {
        delTodoFromState(todoId);
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        if (titleField && titleField.current) {
          titleField.current.focus();
        }
      });
  };

  const toggleAll = () => {
    let updatesTodos = [...todos];

    if (updatesTodos.some(todo => todo.completed === false)) {
      updatesTodos = updatesTodos.map(todo => ({
        ...todo,
        completed: true,
      }));

      setTodos(updatesTodos);
    } else {
      updatesTodos = updatesTodos.map(todo => ({
        ...todo,
        completed: false,
      }));

      setTodos(updatesTodos);
    }
  };

  const handleDeleteCompleted = () => {
    const completedTodos = [...todos].filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      delTodoFromServer(todo.id);
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.ALL) {
      return true;
    }

    if (filter === Filter.ACTIVE) {
      return !todo.completed;
    }

    return todo.completed;
  });

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const onjectContext = {
    todos,
    filteredTodos,
    setTodos,
    filter,
    setFilter,
    toggleAll,
    addTodoToState,
    delTodoFromState,
    handleDeleteCompleted,
    errorMessage,
    setErrorMessage,
    setError,
    titleField,
    delTodoFromServer,
  };

  return (
    <TodosContext.Provider value={onjectContext}>
      {children}
    </TodosContext.Provider>
  );
};
