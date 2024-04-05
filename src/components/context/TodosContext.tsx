import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as todosServices from '../../api/api';
import { useError } from './ErrorContext';
import { Status, TodoError } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/todos';

interface TodosContextType {
  todos: Todo[];
  statusTodo: Status;
  tempTodo: Todo | null;
  isLoading: boolean;
  isProcessing: number[];
  setIsProcessing: Dispatch<SetStateAction<number[]>>;
  setIsLoading: (isLoading: boolean) => void;
  setTempTodo: (_todo: Todo) => void;
  removeTodo: (_todoId: number) => Promise<void>;
  updateTodo: (_updatedTodo: Todo) => void;
  addTodo: (_todo: Todo) => Promise<void>;
  toggleOne: (_updatedTodo: Todo) => void;
  handleClearCompleted: () => void;
  toggleAll: () => void;
  setStatusTodo: (_statusTodo: Status) => void;
}

const contextValue = {
  todos: [],
  statusTodo: Status.All,
  tempTodo: null,
  isLoading: false,
  isProcessing: [],
  setIsProcessing: () => {},
  setIsLoading: () => {},
  setTempTodo: () => {},
  removeTodo: async () => {},
  updateTodo: () => {},
  addTodo: async () => {},
  handleClearCompleted: () => {},
  toggleOne: () => {},
  toggleAll: () => {},
  setStatusTodo: () => {},
};

export const TodosContext = React.createContext<TodosContextType>(contextValue);

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusTodo, setStatusTodo] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number[]>([]);

  const { setErrorMessage } = useError();

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const addTodo = async ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    setTempTodo({
      id: 0,
      title,
      userId,
      completed: false,
    });

    try {
      const newTodo = await todosServices.postTodos({
        title,
        completed,
        userId: USER_ID,
      });

      setTodos(currTodos => [...currTodos, newTodo]);
    } catch (error) {
      setErrorMessage(TodoError.UnableToAdd);
      setTempTodo(null);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setIsLoading(true);

    try {
      await todosServices.deleteTodo(todoId);
      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(TodoError.UnableToDelete);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      const todoEdited = await todosServices.updateTodo(updatedTodo);

      setTodos(currTodos =>
        currTodos.map(todo => (todo.id === updatedTodo.id ? todoEdited : todo)),
      );
    } catch {
      setErrorMessage(TodoError.UnableUpdate);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOne = async (toggledTodo: Todo) => {
    setErrorMessage(null);
    setIsProcessing(prevIds => [...prevIds, toggledTodo.id]);

    try {
      const toggled = await todosServices.updateTodo({
        ...toggledTodo,
        completed: !toggledTodo.completed,
      });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          toggled.id === todo.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(TodoError.UnableUpdate);
    } finally {
      setIsProcessing(prevIds => prevIds.filter(id => id !== toggledTodo.id));
    }
  };

  const toggleAll = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleOne(todo));
    } else {
      completedTodos.forEach(todo => toggleOne(todo));
    }
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  const contextValueMemo = useMemo(
    () => ({
      todos,
      statusTodo,
      tempTodo,
      isLoading,
      isProcessing,
      setIsProcessing,
      setIsLoading,
      setTempTodo,
      removeTodo,
      addTodo,
      updateTodo,
      handleClearCompleted,
      toggleOne,
      toggleAll,
      setStatusTodo,
    }),
    [todos, statusTodo, tempTodo],
  );

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await todosServices.getTodos();

        setTodos(fetchedTodos);
      } catch {
        setErrorMessage(TodoError.UnableToLoad);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider value={contextValueMemo}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};
