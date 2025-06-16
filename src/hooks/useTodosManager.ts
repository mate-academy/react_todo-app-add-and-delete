import { useEffect, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessages, TodoStatus } from '../constants';
import { getActiveTodosCount, getFilteredTodos } from '../utils/todoUtils';
import { useFocus } from './useFocus';

export const useTodosManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const { inputRef, setShouldFocus } = useFocus();

  const activeError = (message: string) => {
    setErrorMessage(message);
  };

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      activeError(ErrorMessages.EMPTY_TITLE);
      setShouldFocus(true);

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo(trimmedTitle)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTempTodo(null);

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      })
      .catch(() => {
        activeError(ErrorMessages.ADD_TODO);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        setShouldFocus(true);
      });
  };

  const handleToggleTodo = (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setLoadingIds(prev => [...prev, todoId]);

    updateTodo(todoId, { completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        activeError(ErrorMessages.UPDATE_TODO);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        activeError(ErrorMessages.DELETE_TODO);
        setShouldFocus(true);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
        setShouldFocus(true);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setErrorMessage('');
    setLoadingIds(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const failedIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            failedIds.push(completedTodos[index].id);
          }
        });

        setTodos(prevTodos =>
          prevTodos.filter(
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );

        if (failedIds.length > 0) {
          activeError(ErrorMessages.DELETE_TODO);
          setShouldFocus(true);
        }
      })
      .finally(() => {
        setLoadingIds(prev =>
          prev.filter(id => !completedTodos.some(todo => todo.id === id)),
        );

        setShouldFocus(true);
      });
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    if (todos.length === 0) {
      return;
    }

    const newCompletedStatus = !allCompleted;

    setLoadingIds(prev => [...prev, ...todos.map(todo => todo.id)]);

    Promise.all(
      todos.map(todo => updateTodo(todo.id, { completed: newCompletedStatus })),
    )
      .then(updatedTodos => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        activeError(ErrorMessages.UPDATE_TODO);
      })
      .finally(() => {
        setLoadingIds(prev =>
          prev.filter(id => !todos.some(todo => todo.id === id)),
        );
      });
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => activeError(ErrorMessages.LOAD_TODOS))
      .finally(() => {
        setLoading(false);
        setShouldFocus(true);
      });
  }, [setShouldFocus]);

  const isDisabled = !todos.some(todo => todo.completed);
  const filteredTodos = getFilteredTodos(todos, filter);
  const todosCounter = getActiveTodosCount(todos);

  return {
    todos,
    loading,
    activeError,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    tempTodo,
    isAdding,
    loadingIds,
    inputRef,
    setShouldFocus,
    allCompleted,
    isDisabled,
    filteredTodos,
    todosCounter,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,
  };
};
