import { useEffect, useState, useRef } from 'react';
import { Todo, TodoError } from '../types/typedefs';
import {
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  USER_ID,
} from '../api/todosMethods';

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const ToDoServiceErrors = {
  Unknown: 'Something went wrong',
  UnableToLoad: 'Unable to load todos',
  Title: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
  UnableToDeleteTodo: 'Unable to delete a todo',
  UnableToUpdateTodo: 'Unable to update todos',
} as const;

const ERROR_DURATION = 3000;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<TodoError | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (todoError: TodoError) => {
    setError(todoError);
    setTimeout(() => {
      setError(null);
    }, ERROR_DURATION);
  };

  useEffect(() => {
    const loadTodos = () => {
      setIsLoading(true);
      getTodos()
        .then(setTodos)
        .catch(() => {
          showError(ToDoServiceErrors.UnableToLoad);
        })
        .finally(() => setIsLoading(false));
    };

    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, loadingTodo]);

  const allCompleted = todos.length > 0 && todos.every(td => td.completed);

  const someCompleted = todos.some(td => td.completed);

  const activeCount = todos.filter(todo => !todo.completed).length;

  const completedCount = todos.filter(todo => todo.completed).length;

  const todosFiltered = (() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  const addTodo = async (title: string) => {
    const noSpaceQuery = title.trim();

    if (!noSpaceQuery) {
      showError(ToDoServiceErrors.Title);

      return false;
    }

    const newTempTodo = {
      id: 0,
      title: noSpaceQuery,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setLoadingTodo(0);

    try {
      const newTodo = await postTodo({
        title: noSpaceQuery,
        completed: false,
        userId: USER_ID,
      });

      setTodos([...todos, newTodo]);

      return true;
    } catch {
      showError(ToDoServiceErrors.UnableToAddTodo);

      return false;
    } finally {
      setLoadingTodo(null);
      setTempTodo(null);
    }
  };

  const clearCompleted = async () => {
    const todosDone = todos.filter(td => td.completed === true);

    if (todosDone.length === 0) {
      return;
    }

    const deleteResults = [];

    for (const todo of todosDone) {
      try {
        await deleteTodo(todo.id);
        deleteResults.push({ id: todo.id, success: true });
      } catch (err) {
        deleteResults.push({ id: todo.id, success: false });
        showError(ToDoServiceErrors.UnableToDeleteTodo);
      }
    }

    const deletedTodos = deleteResults
      .filter(result => result.success)
      .map(result => result.id);

    const stayingTodos = todos.filter(todo => !deletedTodos.includes(todo.id));

    setTodos(stayingTodos);
  };

  const toggleAll = async () => {
    const newIfCompletedStatus = !allCompleted;

    const todosDone = todos.map(td => ({
      ...td,
      completed: newIfCompletedStatus,
    }));

    try {
      await Promise.all(
        todos.map(todo =>
          updateTodo(todo.id, { completed: newIfCompletedStatus }),
        ),
      );

      setTodos(todosDone);
    } catch (err) {
      showError(ToDoServiceErrors.Unknown);
    }
  };

  const clearQuery = () => setQuery('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addTodo(query).then(success => {
      if (success) {
        clearQuery();
      }
    });
  };

  return {
    todos,
    setTodos,
    error,
    setError,
    isLoading,
    setIsLoading,
    filterStatus,
    setFilterStatus,
    todosFiltered,
    tempTodo,
    setTempTodo,
    loadingTodo,
    setLoadingTodo,
    addTodo,
    clearCompleted,
    toggleAll,
    showError,
    query,
    setQuery,
    inputRef,
    clearQuery,
    handleSubmit,
    allCompleted,
    someCompleted,
    activeCount,
    completedCount,
  };
};
