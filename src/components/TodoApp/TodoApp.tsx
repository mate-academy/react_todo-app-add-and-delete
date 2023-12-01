/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';
import { addTodo, deleteTodo, getTodos } from '../../api/todos';
import { UserWarning } from '../../UserWarning';
import { TodoList } from '../TodoList/TodoList';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { TodosContext } from '../GlobalStateProvider/GlobalStateProvider';

interface Props {
  USER_ID: number,
}

export const TodoApp: React.FC<Props> = ({ USER_ID }) => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    status,
    setStatus,
    tempTodo,
    setTempTodo,
    closeErrorMessage,
    inputRef,
    setDeleteTodosIds,
  } = useContext(TodosContext);
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const isSomeCompleted = todos.some(todo => todo.completed);

  const handleErrorMessageClose = () => {
    setErrorMessage('');
  };

  const handleStatusChange = (s: Status) => {
    setStatus(s);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);

    if (!inputValue.trim()) {
      setInputValue('');
      setIsCreating(false);
      setErrorMessage('Title should not be empty');
      closeErrorMessage('');

      return;
    }

    const data = {
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo({
      ...data,
      id: 0,
    });

    addTodo(data)
      .then(newTodo => {
        setTodos(prevState => [...prevState, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        closeErrorMessage('');
      })
      .finally(() => {
        setIsCreating(false);
        setTempTodo(null);
      });
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeleteTodosIds(completedTodoIds);

    Promise.all(
      completedTodoIds.map(id => deleteTodo(id)
        .then(() => id)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          closeErrorMessage('');

          return null;
        })),
    )
      .then(deletedIds => {
        const remainingTodos = todos.filter(
          todo => !deletedIds.includes(todo.id),
        );

        setTodos(remainingTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        closeErrorMessage('');
      })
      .finally(() => {
        setDeleteTodosIds([]);

        if (inputRef) {
          inputRef.current?.focus();
        }
      });
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [inputRef, isCreating]);

  const filteredTodos = todos.filter(todo => {
    switch (status) {
      case Status.ACTIVE:
        return !todo.completed;

      case Status.COMPLETED:
        return todo.completed;

      case Status.ALL:
      default:
        return true;
    }
  });

  const activeTodosCounter = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
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
              ref={inputRef}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              disabled={isCreating}
            />
          </form>
        </header>
        {!!todos.length && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodosCounter} items left`}
              </span>

              <TodosFilter
                status={status}
                onStatusChange={handleStatusChange}
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!isSomeCompleted}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorMessageClose}
        />
        {errorMessage}
      </div>
    </div>
  );
};
