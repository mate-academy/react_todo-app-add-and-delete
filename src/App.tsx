/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './components/UserWarning';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  const setError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const isAllCompleted = useMemo(() => {
    return todos.every(el => el.completed);
  }, [todos]);

  const isAllIncompleted = useMemo(() => {
    return todos.every(el => !el.completed);
  }, [todos]);

  const todosForView = useMemo(() => {
    switch (filter) {
      case Filter.ALL:
        return todos;
      case Filter.ACTIVE:
        return todos.filter(el => !el.completed);
      case Filter.COMPLETED:
        return todos.filter(el => el.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addNewTodo = (title: string) => {
    return new Promise((resolve, reject) => {
      const tempTodo: Todo = {
        title: title,
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTodos(currentTodos => [...currentTodos, tempTodo]);

      addTodo({
        title: title,
        userId: USER_ID,
        completed: false,
      })
        .then(todo => {
          setTodos(currentTodos => [
            ...currentTodos.filter(el => el.id !== 0),
            todo,
          ]);
          resolve(true);
        })
        .catch(() => {
          setError('Unable to add a todo');
          setTodos(currentTodos => [...currentTodos.filter(el => el.id !== 0)]);
          reject(false);
        })
        .finally(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    });
  };

  const handleCompleteTodo = (id: number) => {
    const newTodoList = todos.map(el => {
      return el.id !== id ? el : { ...el, completed: !el.completed };
    });

    setTodos(newTodoList);
  };

  const handleDeleteTodo = (id: number) => {
    return new Promise((resolve, reject) => {
      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => [
            ...currentTodos.filter(el => el.id !== id),
          ]);
          resolve(true);
        })
        .catch(() => {
          setError('Unable to delete a todo');
          setTodos(currentTodos => [...currentTodos.filter(el => el.id !== 0)]);
          reject(false);
        })
        .finally(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    });
  };

  const handleCleareCompleted = () => {
    const todoIds = todos.filter(el => el.completed).map(el => el.id);

    Promise.allSettled(todoIds.map(id => handleDeleteTodo(id)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          addNewTodo={addNewTodo}
          setError={setError}
          inputRef={inputRef}
        />
        {!isLoading && (
          <TodoList
            todos={todosForView}
            handleComplete={handleCompleteTodo}
            handleDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todosCount={todos.filter(el => !el.completed && el.id !== 0).length}
            isAllIncompleted={isAllIncompleted}
            filter={filter}
            clearCompleted={handleCleareCompleted}
            handleSetFilter={setFilter}
          />
        )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage.length === 0 },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
