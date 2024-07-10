import './styles/todoapp.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import { FilterType } from './types/FilterType';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState(FilterType.All);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');

  const focusField = useRef<HTMLInputElement>(null);

  const beforeRequest = () => {
    setShowError(false);
    setIsLoading(true);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setIsLoading(false);

    setTimeout(() => setShowError(false), 3000);
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      handleError('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({
      id: 0,
      title: newTodo.title,
      userId: newTodo.userId,
      completed: newTodo.completed,
    });

    beforeRequest();

    postTodo(newTodo)
      .then(createdTodo => {
        setCurrentTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
        setTempTodo(null);
        setIsLoading(false);

        if (focusField.current) {
          focusField.current.focus();
        }
      })
      .catch(() => {
        handleError('Unable to add a todo');
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setDeletingTodoId(id);
    beforeRequest();

    deleteTodo(id)
      .then(() => {
        setCurrentTodos(prev => prev.filter(todo => todo.id !== id));
        setDeletingTodoId(null);
        setIsLoading(false);
      })
      .catch(() => {
        handleError('Unable to delete a todo');
        setDeletingTodoId(null);
        setIsLoading(false);
      });
  };

  const handleClearCompleted = async () => {
    const completedItems = currentTodos.filter(todo => todo.completed);

    try {
      const deleteCallBack = async (todo: Todo) => {
        try {
          await deleteTodo(todo.id);

          return { id: todo.id, status: 'resolved' };
        } catch {
          handleError('Unable to delete a todo');

          return { id: todo.id, status: 'rejected' };
        }
      };

      const responses = await Promise.all(completedItems.map(deleteCallBack));

      const successfulDeletes = responses
        .filter(response => response.status === 'resolved')
        .map(response => response.id);

      setCurrentTodos(prev =>
        prev.filter(todo => !successfulDeletes.includes(todo.id)),
      );
    } catch {
      handleError('Unable to clear completed todos');
    }
  };

  useEffect(() => {
    if (USER_ID) {
      beforeRequest();
      getTodos()
        .then(todosFromServer => {
          setCurrentTodos(todosFromServer);
        })
        .catch(() => {
          handleError('Unable to load todos');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (focusField.current) {
      focusField.current.focus();
    }
  }, [currentTodos.length, showError]);

  const todoCounter = (todo: Todo[]) => {
    const todosLeft = todo.filter(item => !item.completed);
    const todoCompleted = todo.filter(item => item.completed);

    return {
      todosLeft: todosLeft.length,
      todoCompleted: todoCompleted.length,
    };
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterType.Active:
        return currentTodos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return currentTodos.filter(todo => todo.completed);
      case FilterType.All:
      default:
        return currentTodos;
    }
  }, [filter, currentTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={currentTodos}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
          focusField={focusField}
        />

        {currentTodos.length > 0 && (
          <>
            <TodosList
              todos={filteredTodos}
              onDelete={handleDelete}
              tempTodo={tempTodo}
              deletingTodoId={deletingTodoId}
            />
            <Footer
              todoCount={todoCounter(currentTodos)}
              setFilter={setFilter}
              clearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !showError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowError(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
