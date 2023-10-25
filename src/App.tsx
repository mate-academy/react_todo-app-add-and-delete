/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { addTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { TodosContext } from './stores/TodosContext';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterParams } from './types/FilterParams';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const {
    USER_ID,
    todos,
    filterBy,
    hasErrors,
    waitForResponse,
    setTodos,
    setErrorText,
    setHasErrors,
    setWaitForResponse,
  } = useContext(TodosContext);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHasErrors(false);
    }, 3000);
  }, [hasErrors, setHasErrors]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterBy) {
        default:
        case FilterParams.All:
          return todo;

        case FilterParams.Completed:
          return todo.completed === true;

        case FilterParams.Active:
          return todo.completed === false;
      }
    });
  }, [todos, filterBy]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    setHasErrors(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasErrors(false);
    if (title.trim().length === 0) {
      setHasErrors(true);
      setErrorText(ErrorMessages.EmptyTitle);

      return;
    }

    setWaitForResponse(true);
    setTitle((prevTitle) => prevTitle.trim());

    const newTodo = {
      title: title.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then((response) => {
        setTitle('');
        setTodos((prevTodos) => [...prevTodos, response]);
        setTempTodo(null);
      })
      .catch(() => {
        setHasErrors(true);
        setErrorText(ErrorMessages.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setWaitForResponse(false);
        setTimeout(() => {
          input.current?.focus();
        }, 0);
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={waitForResponse}
              ref={input}
              value={title}
              onChange={handleTitleChange}
            />
          </form>
        </header>

        <TodoList todos={filteredTodos} />

        {tempTodo && (
          <TodoItem title={tempTodo.title} completed={tempTodo.completed} />
        )}

        {!!todos.length && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
