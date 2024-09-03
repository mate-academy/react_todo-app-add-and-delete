/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import * as service from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodos, setFilterTodos] = useState<Filter>(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [todoTitle, setTodoTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    service
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isSubmitting]);

  const filteredTodos = todos.filter(todo => {
    switch (filterTodos) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const todosAmount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  if (!service.USER_ID) {
    return <UserWarning />;
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTodoTitle(event.target.value);
  };

  const addTodo = ({ title }: { title: string }) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: service.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsSubmitting(true);

    service
      .createTodos({
        userId: service.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const deleteTodo = (todoId: number) => {
    return service
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const deleteCompleted = (completed: Todo[]) => {
    for (const completedTodo of completed) {
      if (completedTodo.completed) {
        deleteTodo(completedTodo.id);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodo({ title: todoTitle });
  };

  const handleButtonClose = () => {
    setErrorMessage('');
  };

  const clearCompleted = () => {
    if (completedTodos.length === todos.length) {
      deleteCompleted(todos);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: completedTodos.length === todos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={clearCompleted}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleTitleChange}
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
          ))}
          {tempTodo && <TodoItem todo={tempTodo} />}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todosAmount={todosAmount}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            completedTodos={completedTodos}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleButtonClose}
        />
        {/* show only one message at a time */}
        {/* Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        {errorMessage}
      </div>
    </div>
  );
};
