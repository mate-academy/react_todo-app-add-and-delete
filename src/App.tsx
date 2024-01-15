/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './Components/TodoList';
import {
  Actions,
  DispatchContext,
  Keys,
  StateContext,
} from './Components/Store';
import { TodosType } from './enums/TodosType';
import { createTodo, deleteData } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useContext(DispatchContext);
  const [todoTitle, setTodoTitle] = useState('');
  const {
    allTodos,
    error,
  } = useContext(StateContext);
  const activeTodos = allTodos?.filter(todo => !todo.completed) || [];
  const completedTodos = allTodos?.filter(todo => todo.completed) || [];
  const [visibleTodosType, setVisibleTodosType] = useState(TodosType.all);
  const [errorMessage, setErrorMessage] = useState(error);
  const USER_ID = 12123;
  const ErrorClases = 'notification is-danger '
    + 'is-light has-text-weight-normal';
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);

  const itemsLeft = activeTodos.length === 1
    ? `${activeTodos.length} item left`
    : `${activeTodos.length} items left`;

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  useEffect(() => {
    const currentInputRef = inputRef.current;

    if (currentInputRef !== null) {
      currentInputRef.focus();
    }
  });

  useEffect(() => {
    dispatch({
      type: Actions.setNewUserId,
      userId: USER_ID,
    });
  }, [USER_ID, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  let visibleTodos = allTodos;

  switch (visibleTodosType) {
    case TodosType.active:
      visibleTodos = activeTodos;
      break;
    case TodosType.completed:
      visibleTodos = completedTodos;
      break;
    default:
      visibleTodos = allTodos;
  }

  const handleErrorCanceling = () => {
    setErrorMessage('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleNewTodo = () => {
    if (todoTitle.trim()) {
      const newTitle = todoTitle;

      setInputDisabled(true);
      setTempTodo({
        id: 0,
        title: todoTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      createTodo({
        title: todoTitle.trim(),
        completed: false,
        userId: USER_ID,
      })
        .then(newTodo => {
          dispatch({
            type: Actions.addNew,
            todo: newTodo,
          });
          setTodoTitle('');
        })
        .catch(() => {
          setTodoTitle(newTitle);
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setInputDisabled(false);

          const currentInputRef = inputRef.current;

          if (currentInputRef !== null) {
            currentInputRef.focus();
          }
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  // const handleBlur = () => {
  //   handleNewTodo();
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Keys.Enter) {
      e.preventDefault();

      handleNewTodo();
    }
  };

  const setAllTodosVisible = () => {
    visibleTodos = allTodos;
    setVisibleTodosType(TodosType.all);
  };

  const setActiveTodosVisible = () => {
    visibleTodos = activeTodos;
    setVisibleTodosType(TodosType.active);
  };

  const setComplitedTodosVisible = () => {
    visibleTodos = completedTodos;
    setVisibleTodosType(TodosType.completed);
  };

  const handleToogleAll = () => {
    dispatch({ type: Actions.markAll });
  };

  const destroyCompletedTodos = () => {
    completedTodos.forEach((todo) => {
      deleteData(todo.id)
        .then(() => {
          dispatch({
            type: Actions.destroy,
            todo,
          });
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {!!activeTodos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: !allTodos.length,
              })}
              data-cy="ToggleAllButton"
              disabled={!allTodos.length}
              onClick={handleToogleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              // onBlur={handleBlur}
              ref={inputRef}
              disabled={inputDisabled}
            />
          </form>
        </header>

        <TodoList todos={visibleTodos} tempTodo={tempTodo} />

        {!!allTodos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={cn('filter__link', {
                  selected: visibleTodosType === TodosType.all,
                })}
                onClick={setAllTodosVisible}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: visibleTodosType === TodosType.active,
                })}
                data-cy="FilterLinkActive"
                onClick={setActiveTodosVisible}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: visibleTodosType === TodosType.completed,
                })}
                onClick={setComplitedTodosVisible}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {!!completedTodos.length && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={destroyCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(ErrorClases, {
          hidden: !errorMessage,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorCanceling}
        />
        {/* show only one message at a time */}
        <p>{errorMessage}</p>
        {/* Title should not be empty */}
        {/* Unable to add a todo */}
        {/* Unable to delete a todo */}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
