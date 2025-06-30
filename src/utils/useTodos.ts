import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Todo } from '../types/TodoProps';
import { FilterStatus } from '../types/FilterButtonsProps';
import { USER_ID } from '../api/todos';
import { OptionsError, ERROR_MESSAGES } from '../types/ErrorNotificationsProps';
import { toggleAllTodos, getTodos, addTodo, deleteTodo } from '../api/todos';

type TodosContextType = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  deletingTodoId: number | null;
  isLoading: boolean;
  selectedTodoId: number | null;
  query: string;
  filterStatus: FilterStatus;
  errorMessage: string | null;

  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  handleAddTodo: (title: string, onSuccess?: () => void) => void;
  handleDelete: (id: number) => void;
  handleToggleStatus: (id: number) => void;
  onFormSubmit: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  setSelectedTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setIsAdding: (isAdding: boolean) => void;
  onFocusInput: () => void;
  handleClearCompleted: () => void;
};

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export const TodosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const showError = (type: OptionsError) => {
    setErrorMessage(ERROR_MESSAGES[type]);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => showError('load'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddTodo = (title: string, onSuccess?: () => void) => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError('empty');
      setErrorMessage(ERROR_MESSAGES.empty);
      setIsAdding(false);

      return;
    }

    const TEMP_ID = 0;
    const temp: Todo = {
      id: TEMP_ID,
      title: trimmed,
      completed: false,
      userId: USER_ID,
      isTemp: true,
      todos: [],
    };

    setTempTodo(temp);
    setSelectedTodoId(TEMP_ID);
    setIsAdding(true);
    setErrorMessage(null);

    addTodo({ title: trimmed, completed: false, todos: [] })
      .then(newTodo => {
        setTodos(prev => {
          const filtered = prev.filter(todo => todo.id !== TEMP_ID);

          return [...filtered, newTodo];
        });

        setTempTodo(null);
        setSelectedTodoId(null);
        onSuccess?.();
        setIsAdding(false);
      })
      .catch(() => {
        showError('add');
        setTimeout(() => {
          setTempTodo(null);
          setIsAdding(false);
          setSelectedTodoId(null);
        }, 4000);
      });
  };

  const handleDelete = (id: number) => {
    setDeletingTodoId(id);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('delete');
      })
      .finally(() => {
        setTimeout(() => {
          setDeletingTodoId(null);
        }, 1000);
      });
  };

  const handleToggleStatus = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAddTodo(query, () => setQuery(''));
  };

  const onToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setIsLoading(true);

    toggleAllTodos(todos, !allCompleted)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({ ...todo, completed: !allCompleted })),
        );
      })
      .catch(() => {
        showError('update');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prev =>
        prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      const hasErrors = results.some(r => r.status === 'rejected');

      if (hasErrors) {
        showError('delete');
      }
    } catch {
      showError('delete');
    }
  };

  const onFocusInput = () => {};

  return React.createElement(
    TodosContext.Provider,
    {
      value: {
        todos,
        tempTodo,
        isAdding,
        deletingTodoId,
        isLoading,
        selectedTodoId,
        query,
        filterStatus,
        errorMessage,
        setIsAdding,
        setQuery,
        setFilterStatus,
        handleAddTodo,
        handleDelete,
        handleToggleStatus,
        onFormSubmit: handleFormSubmit,
        onToggleAll,
        setSelectedTodoId,
        setErrorMessage,
        onFocusInput,
        handleClearCompleted,
      },
    },
    children,
  );
};

export const useTodos = (): TodosContextType => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};
