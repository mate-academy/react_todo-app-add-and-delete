import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { UserWarning } from '../../UserWarning';
import * as todosService from '../../api/todos';

const USER_ID = 11383;

type Props = {
  children: React.ReactNode;
};

type TodoContextValue = {
  todos: Todo[];
  todosUncompleted: number;
  todosCompleted: Todo[];
  addTodo: (inputValue: string) => void;
  toggleTodo: (id: number) => void;
  toogleAll: () => void;
  deleteTodo: (id: number) => void;
  deleteComplitedTodo: () => void;
  updateTodo: (updatedTitle: string, id: number) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  tempoTodo: Todo | null;
  setTempoTodo: (tempoTodo: Todo | null) => void;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  isOnAdd: boolean;
  setIsOnAdd: (isOnAdd: boolean) => void;
  isCompliteDeleting: boolean;
  isToogleAllClick: boolean;
};

export const TodoContext = React.createContext<TodoContextValue>({
  todos: [],
  todosUncompleted: 0,
  todosCompleted: [],
  addTodo: () => {},
  toggleTodo: () => {},
  toogleAll: () => {},
  deleteTodo: () => { },
  deleteComplitedTodo: () => { },
  updateTodo: () => { },
  isError: false,
  setIsError: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempoTodo: null,
  setTempoTodo: () => {},
  inputValue: '',
  setInputValue: () => {},
  isOnAdd: false,
  setIsOnAdd: () => {},
  isCompliteDeleting: false,
  isToogleAllClick: false,
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [isOnAdd, setIsOnAdd] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCompliteDeleting, setIsCompliteDeleting] = useState(false);
  const [isToogleAllClick, setIsToogleAllClick] = useState(false);

  useEffect(() => {
    if (USER_ID) {
      todosService.getTodos(USER_ID)
        .then((fetchedTodos) => {
          setTodos(fetchedTodos);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }, []);

  const todosUncompleted = useMemo(() => todos.filter(
    todo => !todo.completed,
  ).length, [todos]);

  const todosCompleted = useMemo(() => todos.filter(
    todo => todo.completed,
  ), [todos]);

  const createTempTodo = () => ({
    id: 0,
    userId: USER_ID,
    title: inputValue,
    completed: false,
  });

  const handleAddTodoError = () => {
    setIsError(true);
    setErrorMessage('Unable to add a todo');

    setTimeout(() => {
      setIsError(false);
      setErrorMessage('');
    }, 3000);
  };

  const resetAddTodoState = () => {
    setTempoTodo(null);
    setInputValue('');
    setIsOnAdd(false);
  };

  const addTodo = async () => {
    setIsOnAdd(true);

    try {
      const tempTodo = createTempTodo();

      setTempoTodo(tempTodo);
      const newTodo = await todosService.createTodo(tempTodo);

      if (newTodo) {
        setTodos([...todos, newTodo]);
      }
    } catch (error) {
      handleAddTodoError();
    } finally {
      resetAddTodoState();
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = [...todos];
    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
      updatedTodos[index].completed = !updatedTodos[index].completed;
    }

    setTodos(updatedTodos);
  };

  const toogleAll = () => {
    setIsToogleAllClick(true);

    const allCompleted = todos.every(todo => todo.completed === true);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
    setTimeout(() => {
      setIsToogleAllClick(false);
    }, 500);
  };

  const deleteTodo = async (id: number) => {
    try {
      await todosService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setIsError(true);
      setErrorMessage('Unable to delete a todo');

      setTimeout(() => {
        setIsError(false);
        setErrorMessage('');
      }, 3000);
    }
  };

  const deleteComplitedTodo = async () => {
    if (todosCompleted.length > 0) {
      setIsCompliteDeleting(true);
      try {
        const deletionPromises = todosCompleted.map(
          todo => todosService.deleteTodo(todo.id),
        );

        await Promise.all(deletionPromises);
        setTodos(todos.filter(todo => !todo.completed));
      } catch (error) {
        setIsError(true);
        setErrorMessage('Unable to delete a todos');

        setTimeout(() => {
          setIsError(false);
          setErrorMessage('');
        }, 3000);
      } finally {
        setIsCompliteDeleting(false);
      }
    }
  };

  const updateTodo = (updatedTitle: string, id: number) => {
    const updatedTodos = [...todos];
    const todoToUpdate = updatedTodos.find(todo => todo.id === id);

    if (todoToUpdate) {
      todoToUpdate.title = updatedTitle;
    }

    setTodos(updatedTodos);
  };

  const contextValue: TodoContextValue = {
    todos,
    todosUncompleted,
    todosCompleted,
    addTodo,
    toggleTodo,
    toogleAll,
    deleteTodo,
    deleteComplitedTodo,
    updateTodo,
    isError,
    setIsError,
    errorMessage,
    setErrorMessage,
    tempoTodo,
    setTempoTodo,
    inputValue,
    setInputValue,
    isOnAdd,
    setIsOnAdd,
    isCompliteDeleting,
    isToogleAllClick,
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextValue => React.useContext(TodoContext);
