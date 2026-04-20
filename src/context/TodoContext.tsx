/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';

export const FILTER_TYPE = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const ERROR_TYPE = {
  LOAD: 'loadError',
  TITLE: 'titleError',
  ADD: 'addError',
  DELETE: 'deleteError',
  UPDATE: 'updateError',
  NONE: 'none',
} as const;

interface TodoContextType {
  todos: Todo[];
  todoTitle: string;
  filteredTodos: Todo[];
  filterBy: string;
  setFilterBy: (filter: string) => void;
  loadingIds: number[];
  error: string;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  unfinishedTodos: Todo[];
  editTodoTitle: string;
  setEditTodoTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  handleEditingTodo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleAll: (todos: Todo[]) => void;
  handleEditFormSubmission: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  handleCloseError: () => void;
  handleTodoToggle: (todo: Todo) => void;
  handleClearCompleted: (todos: Todo[]) => void;
  handleSubmitNewTodo: (e: React.FormEvent) => void;
}

export const TodoContext = React.createContext<TodoContextType>(
  {} as TodoContextType,
);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterBy, setFilterBy] = useState<string>(FILTER_TYPE.ALL);
  const [error, setError] = useState<string>(ERROR_TYPE.NONE);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Carregamento Inicial
  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setError(ERROR_TYPE.LOAD));
  }, []);

  // 2. Foco automático no input principal
  useEffect(() => {
    if (!editingId) {
      inputRef.current?.focus();
    }
  }, [todos, tempTodo, error, editingId]);

  // 3. Efeito para esconder o erro após 3 segundos
  useEffect(() => {
    if (error !== ERROR_TYPE.NONE) {
      const timer = setTimeout(() => {
        setError(ERROR_TYPE.NONE);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return () => {};
  }, [error]);

  const handleCloseError = useCallback(() => setError(ERROR_TYPE.NONE), []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTodoTitle(e.target.value);

  const handleEditingTodo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditTodoTitle(e.target.value);

  // --- ADICIONAR TODO ---
  const handleSubmitNewTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setError(ERROR_TYPE.TITLE);

      return;
    }

    const newTodoData = {
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo({ ...newTodoData, id: 0 } as Todo);
    setLoadingIds(prev => [...prev, 0]);
    setError(ERROR_TYPE.NONE);

    todoService
      .postTodo(newTodoData)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTodoTitle('');
      })
      .catch(() => setError(ERROR_TYPE.ADD))
      .finally(() => {
        setTempTodo(null);
        setLoadingIds(prev => prev.filter(id => id !== 0));
      });
  };

  // --- DELETAR TODO ---
  const handleDeleteTodo = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ERROR_TYPE.DELETE);
        setLoadingIds(prev => prev.filter(curr => curr !== id));
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(curr => curr !== id));
      });
  };

  // --- EDITAR TODO (SUBMISSÃO) ---
  const handleEditFormSubmission = (todo: Todo) => {
    const trimmedTitle = editTodoTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .patchTodo({ ...todo, title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
        setEditingId(null);
      })
      .catch(() => setError(ERROR_TYPE.UPDATE))
      .finally(() => {
        setLoadingIds(prev => prev.filter(curr => curr !== todo.id));
      });
  };

  // --- ALTERAR STATUS (CHECKBOX) ---
  const handleTodoToggle = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .patchTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      })
      .catch(() => setError(ERROR_TYPE.UPDATE))
      .finally(() => {
        setLoadingIds(prev => prev.filter(curr => curr !== todo.id));
      });
  };

  // --- ALTERAR STATUS DE TODOS (TOGGLE ALL) ---
  const handleToggleAll = (allTodos: Todo[]) => {
    const areAllCompleted = allTodos.every(t => t.completed);
    const todosToUpdate = areAllCompleted
      ? allTodos
      : allTodos.filter(t => !t.completed);

    setLoadingIds(prev => [...prev, ...todosToUpdate.map(t => t.id)]);

    const updatePromises = todosToUpdate.map(t =>
      todoService.patchTodo({ ...t, completed: !areAllCompleted }),
    );

    Promise.allSettled(updatePromises)
      .then(results => {
        const successfullyUpdated: Todo[] = [];
        let hasError = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfullyUpdated.push(result.value);
          } else {
            hasError = true;
          }
        });

        setTodos(prev =>
          prev.map(t => {
            const found = successfullyUpdated.find(res => res.id === t.id);

            return found || t;
          }),
        );

        if (hasError) {
          setError(ERROR_TYPE.UPDATE);
        }
      })
      .finally(() => setLoadingIds([]));
  };

  // --- LIMPAR COMPLETADOS ---
  const handleClearCompleted = (allTodos: Todo[]) => {
    const completed = allTodos.filter(t => t.completed);
    const completedIds = completed.map(t => t.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    const deletePromises = completed.map(t =>
      todoService.deleteTodo(t.id).then(() => t.id),
    );

    Promise.allSettled(deletePromises)
      .then(results => {
        const deletedIds: number[] = [];
        let hasError = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            deletedIds.push(result.value);
          } else {
            hasError = true;
          }
        });

        // Remove apenas os que foram deletados com sucesso no servidor
        setTodos(prev => prev.filter(t => !deletedIds.includes(t.id)));

        if (hasError) {
          setError(ERROR_TYPE.DELETE);
        }
      })
      .finally(() => setLoadingIds([]));
  };

  const unfinishedTodos = todos.filter(t => !t.completed);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterBy === FILTER_TYPE.ACTIVE) {
        return !todo.completed;
      }

      if (filterBy === FILTER_TYPE.COMPLETED) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterBy]);

  const value = {
    todos,
    todoTitle,
    filteredTodos,
    filterBy,
    setFilterBy,
    loadingIds,
    error,
    editingId,
    setEditingId,
    unfinishedTodos,
    editTodoTitle,
    setEditTodoTitle,
    inputRef,
    tempTodo,
    handleEditingTodo,
    handleTitleChange,
    handleToggleAll,
    handleEditFormSubmission,
    handleDeleteTodo,
    handleCloseError,
    handleTodoToggle,
    handleClearCompleted,
    handleSubmitNewTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
