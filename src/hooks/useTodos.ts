import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { getFilteredTodos, Todo } from '../types/Todo';
import { StatusFilter } from '../types/statusFilter';
import { ErrorMessage } from '../types/error';
import { todosService, USER_ID } from '../api/todos';
import useErrors from './useErrors';

const useTodos = () => {
  // #region State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(StatusFilter.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { errorMessage, showError, hideError } = useErrors();

  const addInputRef = useRef<HTMLInputElement>(null);

  // #endregion

  // #region Effects
  useEffect(() => {
    const loadTodos = async () => {
      showError(ErrorMessage.Null);

      try {
        const todosFromServer = await todosService.getTodos();

        setTodos(todosFromServer);
      } catch {
        showError(ErrorMessage.LoadingTodos);
      }
    };

    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      addInputRef.current?.focus();
    }
  }, [tempTodo, todos]);

  // #endregion

  // #region Helpers
  const filteredTodos = getFilteredTodos(todos, { status });

  const todosLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  // #endregion

  // #region Handlers
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  const handleStatusChange = useCallback((newStatus: StatusFilter) => {
    setStatus(newStatus);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        showError(ErrorMessage.EmptyTitle);

        return;
      }

      const temporaryTodo: Todo = {
        id: 0,
        title: normalizedQuery,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temporaryTodo);
      setLoadingTodoIds([temporaryTodo.id]);

      try {
        const newTodo = await todosService.createTodo({
          title: normalizedQuery,
        });

        setTodos(prev => [...prev, newTodo]);
        setQuery('');
      } catch {
        showError(ErrorMessage.AddingTodo);
      } finally {
        setTempTodo(null);
        setLoadingTodoIds([]);
      }
    },
    [query, showError],
  );

  const handleAddTodoToLoading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentLoading => [...currentLoading, todoId]);
  };

  const handleRemoveTodoFromLoading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentLoading =>
      currentLoading.filter(id => id !== todoId),
    );
  };

  const getIsTodoLoading = (todoId: Todo['id']) => {
    return loadingTodoIds.includes(todoId);
  };

  const handleDelete = useCallback(
    async (todoId: Todo['id']) => {
      handleAddTodoToLoading(todoId);

      await todosService
        .deleteTodo(todoId)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          showError(ErrorMessage.DeletingTodo);
        })
        .finally(() => {
          handleRemoveTodoFromLoading(todoId);
        });
    },
    [showError],
  );

  const handleDeleteAllCompleted = useCallback(async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setLoadingTodoIds(completedIds);
    // filter out only resolved todos and keep only failed
    await Promise.all(completedIds.map(id => handleDelete(id)));
    setLoadingTodoIds([]);
  }, [todos, handleDelete]);
  // #endregion

  return {
    todos,
    query,
    status,
    tempTodo,
    todosLeft,
    addInputRef,

    filteredTodos,
    getIsTodoLoading,

    errorMessage,
    showError,
    hideError,

    handleSubmit,
    handleDelete,
    handleQueryChange,
    handleStatusChange,
    handleDeleteAllCompleted,
  };
};

export default useTodos;
