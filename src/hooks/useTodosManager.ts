import { useEffect, useState } from 'react';
import { getTodos, deleteTodo, USER_ID, addTodo } from '../api/todos';
import { ErrorMessages } from '../components/contants';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { getActiveTodosCount, getFilteredTodos } from '../utils/todoUtils';
import { useFocus } from './useFocus';

export const useTodosManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const { inputRef, setShouldFocus } = useFocus();

  const activeError = (message: string) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.LOAD_TODOS))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);
      setShouldFocus(true);

      return;
    }

    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoading(true);

    addTodo(newTempTodo)
      .then(addedTodo => {
        setTodos(prev => [...prev, addedTodo]);
        setTempTodo(null);

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      })
      .catch(() => {
        activeError(ErrorMessages.ADD_TODO);
        setLoading(false);
      })
      .finally(() => {
        setShouldFocus(true);
        setTempTodo(null);
        setLoading(false);
      });
  };

  const handlDeleteTodo = (todoId: number) => {
    setLoadingId(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(ErrorMessages.DELETE_TODO))
      .finally(() => {
        setLoadingId(prev => prev.filter(id => id !== todoId));
        setShouldFocus(true);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handlDeleteTodo(todo.id);
      }
    });
  };

  const todosCounter = getActiveTodosCount(todos);
  const preparedTodos = getFilteredTodos(todos, filter);
  const isDisabled = !todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return {
    todos,
    loading,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    todosCounter,
    preparedTodos,
    handlDeleteTodo,
    handleClearCompleted,
    handleAddTodo,
    tempTodo,
    inputRef,
    setShouldFocus,
    loadingId,
    setLoadingId,
    activeError,
    isDisabled,
    allCompleted,
  };
};
