/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Status } from './types/Status';
import { Errors } from './types/Errors';
import { TodosFilter } from './components/TodoFilter/TodoFilter';

const USER_ID = 7023;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredType, setFilteredType] = useState(Status.All);
  const [, setTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [title, setTitle] = useState<string>('');

  const titleRef = useRef<HTMLInputElement | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed === true);

    if (allCompleted) {
      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      setTodos(updatedTodos);
    } else {
      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: true,
      }));

      setTodos(updatedTodos);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Errors.EMPTY_TITLE);
      setTitle('');

      return;
    }

    setIsInputDisabled(true);
    const newTodo: Todo = {
      title: title.trim(),
      userId: USER_ID,
      id: +Date,
      completed: false,
    };

    setTodo(newTodo);

    addTodo({ title: title.trim(), userId: USER_ID, completed: false })
      .then(todo => setTodos((currentTodos) => [...currentTodos, todo]))
      .catch(() => {
        setTitle(title);
        setErrorMessage(Errors.CAN_NOT_ADD_TODO);
      })
      .finally(() => {
        setTodo(null);
        setIsInputDisabled(false);
      });

    setTitle('');
  };

  const handleToggleTodo = (id: number) => {
    const updatedTodos = todos.map(currentTodo => {
      if (currentTodo.id === id) {
        return { ...currentTodo, completed: !currentTodo.completed };
      }

      return currentTodo;
    });

    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (todo: Todo) => {
    deleteTodo(todo.id)
      .catch(() => setErrorMessage(Errors.CAN_NOT_DELETE_TODO))
      .finally(() => {
        setTodos(current => current.filter(item => item.id !== todo.id));
      });
  };

  const handleDeleteCompleted = async () => {
    const deletedTodo = todos.filter(todo => todo.completed);
    const needToDelete = deletedTodo.map(todo => {
      return deleteTodo(todo.id);
    });

    try {
      await Promise.allSettled(needToDelete);
      const newTodos = todos.filter(todo => !todo.completed);

      setTodos(newTodos);
    } catch {
      () => {
        setErrorMessage(Errors.CAN_NOT_DELETE_TODO);
      };
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filteredType) {
        case Status.All:
          return true;
        case Status.Completed:
          return todo.completed;
        case Status.Active:
          return !todo.completed;
        default:
          return true;
      }
    });
  }, [filteredType, todos]);

  useEffect(() => {
    setErrorMessage(null);
    getTodos(USER_ID).then(todo => setTodos(todo)).catch(() => {
      setErrorMessage(Errors.LOAD_ERROR);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage, setErrorMessage]);
  if (!USER_ID) {
    return <UserWarning />;
  }

  const leftToComplete = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const showClearButton = useMemo(() => {
    return todos.filter(todo => todo.completed).length > 0;
  }, [todos]);

  useEffect(() => {
    titleRef.current?.focus();
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: todos.length > 0 })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              value={title}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleRef}
              disabled={isInputDisabled}
              onChange={handleTitleChange}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodo={handleToggleTodo}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${leftToComplete} items left`}
          </span>

          <TodosFilter
            filteredType={filteredType}
            setFilteredType={setFilteredType}
          />
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!showClearButton}
            onClick={handleDeleteCompleted}
          >
            Clear completed
          </button>
        </footer>
      </div>

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className={
            cn('notification is-danger is-light has-text-weight-normal',
              { hidden: !errorMessage })
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage(null)}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
