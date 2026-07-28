import { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { getTodos, postTodo, deleteTodo,updateTodo, USER_ID } from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    postTodo(trimmedTitle)
      .then(newTodo => {
        setTitle('');
        setTodos(prev => [...prev, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'all':
      default:
        return true;
    }
  });

  const onDelete = (todoId : number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId).then(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    }).catch(() => {
      setErrorMessage('Unable to delete a todo');
    }).finally(() => {
      setLoadingTodoIds(loadingTodoIds.filter(id => id !== todoId));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    })
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const isEveryCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const clearCompleted = () => {
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if(completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...completedIds]);
    const deletePromise = completedIds.map(id => deleteTodo(id));

    Promise.allSettled(deletePromise).then((results) => {
      const successfulIds: number[] = [];
      let hasError = false;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulIds.push(completedIds[index]);
        } else {
          hasError = true;
        }
      });

      setTodos(prevTodos => prevTodos.filter(todo => !successfulIds.includes(todo.id)));

      if(hasError) {
        setErrorMessage('Unable to delete a todo');
      }
    }).finally(() => {
      setLoadingTodoIds(prev =>
        prev.filter(id => !completedIds.includes(id)),
      );

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    })
  }

  const toggleTodo = (todoToUpdate: Todo) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);

    const updatedStatus = !todoToUpdate.completed;

    updateTodo({ ...todoToUpdate, completed: updatedStatus })
    .then(updatedTodo => {
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    })
    .catch(() => {
      setErrorMessage('Unable to update a todo');
    })
    .finally(() => {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    });
  }

  return {
    todos,
    visibleTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    title,
    setTitle,
    activeTodosCount,
    isEveryCompleted,
    isSubmitting,
    tempTodo,
    loadingTodoIds,
    inputRef,
    handleAddTodo,
    onDelete,
    clearCompleted,
    toggleTodo,
    completedTodosCount
  };
};
