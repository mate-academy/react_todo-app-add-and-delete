import React from 'react';
import { Todo } from '../types/Todo';
import {
  getTodos,
  postTodo,
  patchTodo,
  deleteTodo,
  patchAllTodos,
  USER_ID,
} from '../api/todos';
import { FILTER_TYPE, ERROR_TYPE } from '../consts/constants';


type TodoContextType = {
  unfinishedTodos: Todo[];
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoTitle: string;
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  filteredTodos: Todo[];
  filterBy: FilterType;
  setFilterBy: React.Dispatch<React.SetStateAction<FilterType>>;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  error: Errors;
  setError: React.Dispatch<React.SetStateAction<Errors>>;
  editTodoTitle: string;
  setEditTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSubmitNewTodo: (event: React.FormEvent) => void;
  handleDeleteTodo: (id: number) => void;
  handleToggleAll: (todos: Todo[]) => void;
  handleEditingTodo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditFormSubmission: (todo: Todo) => void;
  handleClearCompleted: (Todos: Todo[]) => void;
  handleCloseError: () => void;
  handleTodoToggle: (todo: Todo) => void;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type FilterType = 'all' | 'active' | 'completed';

type Errors =
  | 'loadError'
  | 'titleError'
  | 'addError'
  | 'deleteError'
  | 'updateError'
  | 'none';

export const TodoContext = React.createContext<TodoContextType>({
  unfinishedTodos: [],
  todos: [],
  setTodos: () => {},
  todoTitle: '',
  setTodoTitle: () => {},
  filteredTodos: [],
  filterBy: FILTER_TYPE.ALL,
  loadingIds: [],
  setLoadingIds: () => {},
  setFilterBy: () => {},
  error: ERROR_TYPE.NONE,
  setError: () => {},
  editTodoTitle: '',
  setEditTodoTitle: () => {},
  editingId: null,
  setEditingId: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  inputRef: React.createRef(),
  handleSubmitNewTodo: () => {},
  handleTodoToggle: () => {},
  handleEditingTodo: () => {},
  handleEditFormSubmission: () => {},
  handleClearCompleted: () => {},
  handleToggleAll: () => {},
  handleCloseError: () => {},
  handleDeleteTodo: () => {},
  handleTitleChange: () => {},
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = React.useState<string>('');
  const [filterBy, setFilterBy] = React.useState<FilterType>(FILTER_TYPE.ALL);
  const [loadingIds, setLoadingIds] = React.useState<number[]>([]);
  const [error, setError] = React.useState<Errors>(ERROR_TYPE.NONE);
  const [editTodoTitle, setEditTodoTitle] = React.useState<string>('');
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [shouldFocusInput, setShouldFocusInput] = React.useState(true);

  const errorRef = React.useRef<number | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  const handleError = React.useCallback((errorType: Errors) => {
    if (errorRef.current) {
      window.clearTimeout(errorRef.current);
    }

    setError(errorType);

    const newTimeout = window.setTimeout(() => {
      setError(ERROR_TYPE.NONE);
    }, 3000);

    errorRef.current = newTimeout;
  }, []);

  React.useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(ERROR_TYPE.LOAD));
  }, [handleError]);

  const filteredTodos = React.useMemo(() => {
    switch (filterBy) {
      case FILTER_TYPE.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTER_TYPE.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const unfinishedTodos = todos.filter(todo => !todo.completed);

  const handleSubmitNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      handleError(ERROR_TYPE.TITLE);
      setShouldFocusInput(true);

      return;
    }

    setLoadingIds(prev => [...prev, 0]);

    const newTempTodo = {
      id: 0,
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    const newTodo = {
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    postTodo(newTodo)
      .then(responseTodo => {
        setTodos([...todos, responseTodo]);
        setTempTodo(null);
        setTodoTitle('');
        setShouldFocusInput(true);
      })
      .catch(() => {
        setTempTodo(null);
        setTodoTitle(prevTitle => prevTitle.trim());
        handleError(ERROR_TYPE.ADD);
        setShouldFocusInput(true);
      })
      .finally(() => setLoadingIds(prev => prev.filter(id => id !== 0)));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleEditingTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTodoTitle(event.target.value);
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(t => t.id !== id));
        setShouldFocusInput(true);
      })
      .catch(() => handleError(ERROR_TYPE.DELETE))
      .finally(() => setLoadingIds(prev => prev.filter(i => i !== id)));
  };

  const handleUpdatedTodos = (id: number, updatedTodo: Todo) => {
    setLoadingIds(prev => [...prev, id]);
    patchTodo(updatedTodo)
      .then(() => {
        setTodos(todos.map(t => (t.id === id ? { ...t, ...updatedTodo } : t)));
      })
      .catch(() => handleError(ERROR_TYPE.UPDATE))
      .finally(() => setLoadingIds(prev => prev.filter(i => i !== id)));
  };

  const handleEditFormSubmission = (todo: Todo) => {
    const trimedEditTodoTitle = editTodoTitle.trim();

    if (!trimedEditTodoTitle) {
      handleDeleteTodo(todo.id);
      setEditingId(null);

      return;
    }

    handleUpdatedTodos(todo.id, { ...todo, title: trimedEditTodoTitle });
    setEditingId(null);
  };

  const handleTodoToggle = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);
    patchTodo({ ...todo, completed: !todo.completed })
      .then(() => {
        setTodos(
          todos.map(t =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t,
          ),
        );
      })
      .catch(() => handleError(ERROR_TYPE.UPDATE))
      .finally(() => setLoadingIds(prev => prev.filter(id => id !== todo.id)));
  };

  const handleCloseError = () => {
    setError(ERROR_TYPE.NONE);
  };

  const handleToggleAll = (passedTodos: Todo[]) => {
    patchAllTodos(passedTodos);

    setTodos(prevTodos => {
      const completed = !prevTodos.every(todo => todo.completed);

      return prevTodos.map(todo => ({ ...todo, completed }));
    });
  };

  const handleClearCompleted = (completedTodos: Todo[]) => {
    const completedIds = completedTodos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const promises = completedIds.map(id => deleteTodo(id));

    Promise.allSettled(promises).then(results => {
      const successfullyDeletedIds = completedIds.filter(
        (id, i) => results[i].status === 'fulfilled',
      );

      if (successfullyDeletedIds.length > 0) {
        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );
      }

      if (successfullyDeletedIds.length < completedIds.length) {
        handleError(ERROR_TYPE.DELETE);
      }

      setShouldFocusInput(true);
    });
  };

  const value = {
    unfinishedTodos,
    todos,
    setTodos,
    todoTitle,
    setTodoTitle,
    filteredTodos,
    filterBy,
    setFilterBy,
    loadingIds,
    setLoadingIds,
    error,
    setError,
    editTodoTitle,
    setEditTodoTitle,
    editingId,
    setEditingId,
    tempTodo,
    setTempTodo,
    inputRef,
    handleEditingTodo,
    handleClearCompleted,
    handleEditFormSubmission,
    handleSubmitNewTodo,
    handleToggleAll,
    handleCloseError,
    handleTodoToggle,
    handleDeleteTodo,
    handleTitleChange,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
