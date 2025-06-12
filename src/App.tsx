/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';
import { StatusFilter } from './types/TodoStatus';
import { NewTodo } from './types/NewTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [hasErrorMessage, setHasErrorMesage] = useState('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [, setHasActive] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const timerId = useRef<number | null>(null);

  const showError = (messageError: string) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setIsError(true);
    setHasErrorMesage(messageError);
    timerId.current = window.setTimeout(setIsError, 3000, false);
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });

    inputRef.current?.focus();

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  const addTodo = ({
    title,
    userId = postService.USER_ID,
    completed = false,
  }: NewTodo) => {
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempTodo({ id: 0, title, userId, completed });

    postService
      .postTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);

        setQuery('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    return new Promise<void>((resolve, rejected) => {
      postService
        .deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodo => prevTodo.filter(todo => todo.id !== todoId));
          resolve();
        })
        .catch(err => {
          showError('Unable to delete a todo');
          inputRef.current?.focus();
          rejected(err);
        })
        .finally(() => {
          inputRef.current?.focus();
          setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        });
    });
  };

  const deleteActiveItems = () => {
    const activeItems = todos.filter(todo => todo.completed);

    const deleteRequest = activeItems.map(item => deleteTodo(item.id));

    Promise.all(deleteRequest);
  };

  const filterTodosByStatus = () => {
    if (statusFilter === StatusFilter.All) {
      return todos;
    }

    if (statusFilter === StatusFilter.Active) {
      return [...todos].filter(todo => !todo.completed);
    }

    if (statusFilter === StatusFilter.Completed) {
      return [...todos].filter(todo => todo.completed);
    }
  };

  const countActiveItems = () => {
    return todos.filter(todo => !todo.completed).length;
    // console.log(quantityActiveItems);
  };

  const findActiveElement = () => {
    const activeElement = todos.find(todo => todo.completed);

    if (activeElement) {
      setHasActive(true);
    } else {
      setHasActive(false);
    }

    return !!activeElement;
  };

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form
            onSubmit={e => {
              e.preventDefault();

              const clearQuery = query.trim();

              if (clearQuery) {
                addTodo({ title: clearQuery });
              } else {
                showError('Title should not be empty');
              }
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              value={query}
              onChange={e => setQuery(e.target.value)}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filterTodosByStatus() ?? []}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            loadingTodoIds={loadingTodoIds}
          />
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            quantityActiveItems={countActiveItems()}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
            onFindActive={findActiveElement}
            onDeleteActive={deleteActiveItems}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error
        isError={isError}
        errorMessage={hasErrorMessage}
        onError={setIsError}
      />
    </div>
  );
};
