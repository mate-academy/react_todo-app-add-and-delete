import React, {
  ReactNode, createContext, useContext, useEffect, useState,
} from 'react';
import * as serviceTodo from '../../api/todos';
import { Todo } from '../../types/Todo';

const USER_ID = 11585;

interface TodosContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  errVisible: boolean;
  setErrVisible: React.Dispatch<React.SetStateAction<boolean>>;
  USER_ID: number;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  deleteTodo: (todoId: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateTodo: (e: React.FormEvent) => void;
  newTodo: string;
  disableInput: boolean;
  isLoading: boolean;
  tempTodo: Todo | null;
  loadingTodoId: number | null;
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export const TodosProvider: React
  .FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const [err, setError] = useState<string>('');
  const [errVisible, setErrVisible] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>('all');

  const [newTodo, setNewTodo] = useState<string>('');

  const [disableInput, setDisableInput] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const showError = (message: string) => {
    setError(message);
    setErrVisible(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timer) {
      clearTimeout(timer);
    }

    if (errVisible) {
      // Якщо помилка видима, встановлюємо таймер на 3 секунди
      timer = setTimeout(() => {
        setError('');
        setErrVisible(false);
      }, 3000);
    }
  }, [errVisible]);

  // eslint-disable-next-line max-len
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableInput(true);
    if (newTodo.trim() === '') {
      showError('Title should not be empty');
      setDisableInput(false);
      setNewTodo('');

      return;
    }

    const newTodoItem: Todo = {
      id: 0, // Set the id to 0 for the temporary todo
      title: newTodo.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodoItem);
    setIsLoading(true);

    try {
      // Your API call to create todo here
      const loadedTodo = await serviceTodo.createTodo(newTodoItem);

      // Update tempTodo with the loaded todo from the API response
      setTempTodo(loadedTodo as Todo);
      setTodos([...todos, loadedTodo as Todo]);
      setNewTodo('');
    } catch (error) {
      setDisableInput(false);
      showError('Unable to add a todo');
    } finally {
      setIsLoading(false);
      setTempTodo(null);
      setDisableInput(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    setLoadingTodoId(todoId);

    if (todoToDelete) {
      setTodos(todos.filter(t => t.id !== todoId));
      try {
        await serviceTodo.deleteTodo(todoId);
      } catch (error) {
        showError('Unable to delete a todo');
      } finally {
        setLoadingTodoId(null);
      }
    }
  };

  useEffect(() => {
    serviceTodo.getTodos(USER_ID)
      .then((todosData) => {
        setTodos(todosData);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  const contextValues = {
    todos,
    setTodos,
    error: err,
    setError,
    errVisible,
    setErrVisible,
    USER_ID,
    filter,
    setFilter,
    deleteTodo,
    handleInputChange,
    handleCreateTodo,
    newTodo,
    disableInput,
    isLoading,
    tempTodo,
    loadingTodoId,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = (): TodosContextType => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};
