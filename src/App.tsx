/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ERROR_MESSAGES, FILTERS } from './utils/constants';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredField, setFiltredField] = useState<FILTERS>(FILTERS.ALL);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosId, setDeletingTodosId] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos],
  );
  const [hasCompleted, setHasCompleted] = useState(completedCount > 0);

  const filtredTodos = useMemo(() => {
    let filtered: Todo[];

    switch (filtredField) {
      case FILTERS.ACTIVE:
        filtered = todos.filter(t => !t.completed);
        break;

      case FILTERS.COMPLETED:
        filtered = todos.filter(t => t.completed);
        break;

      default:
        filtered = todos;
    }

    return filtered;
  }, [todos, filtredField]);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => showError(ERROR_MESSAGES.LOAD_TODOS))
      .finally(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    setHasCompleted(completedCount > 0);
  }, [completedCount]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteErrors = () => {
    setError(null);
  };

  const onFiltr = (field: FILTERS) => {
    if (field === filtredField) {
      return;
    }

    setFiltredField(field);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitle('');
      showError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then(result => {
        setTodos(prev => [...prev, result]);
        setTitle('');
      })
      .catch(() => {
        showError(ERROR_MESSAGES.ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodosId(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(items => items.filter(i => i.id !== todoId));
      })
      .catch(() => {
        setError(ERROR_MESSAGES.DELETE_TODO);
      })
      .finally(() => {
        setDeletingTodosId(prev => prev.filter(id => id !== todoId));
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const deleteCompleted = () => {
    setHasCompleted(false);

    todos.forEach(t => {
      if (t.completed) {
        handleDelete(t.id);
      }
    });
  };

  // const handleUpdate = (todoId: number, completed: boolean) => {
  //   updateTodo(todoId, completed)
  //     .then(() => {
  //       setTodos(todosList =>
  //         todosList.map(t => {
  //           if (t.id === todoId) {
  //             return { ...t, completed: completed };
  //           }

  //           return t;
  //         }),
  //       );

  //       if (completed) {
  //         setCompletedCount(prev => prev + 1);
  //       } else {
  //         setCompletedCount(prev => prev - 1);
  //       }
  //     })
  //     .catch(() => showError(ERROR_MESSAGES.UPDATE_TODO));
  // };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllTodosCompleted={completedCount === todos.length}
          title={title}
          setTitle={setTitle}
          onAdd={handleAdd}
          tempTodo={tempTodo}
          ref={inputRef}
        />
        <TodoList
          todos={filtredTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          deletingTodosId={deletingTodosId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeTodosCount={todos.length - completedCount}
            filtredField={filtredField}
            onFiltr={onFiltr}
            hasCompleted={hasCompleted}
            onDeleteCompleted={deleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={deleteErrors}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
