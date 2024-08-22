/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTypes } from './types/FilterTypes';
import classNames from 'classnames';
import { filterTodos } from './helper/utilsFunctions';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [todoTitle, setTodoTitle] = useState('');
  const [isTodosLoadedError, setIsTodosLoadedError] = useState(false);
  const [isTitleError, setIsTitleError] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isRequestHasError, setIsRequestHasError] = useState(false);
  const [isDeletedTodoHasLoader, setIsDeletedTodoHasLoader] = useState(false);
  const [isDeletedRequestHasError, setIsDeletedRequestHasError] =
    useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const areTodosExist = !!todos.length;
  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const isAnyCompletedTodos = notCompletedTodosCount === todos.length;

  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const filteredTodos = filterTodos(todos, selectedTodos);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, isRequestHasError]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setIsErrorHidden(false);
        setIsTodosLoadedError(true);
        setTimeout(() => {
          setIsErrorHidden(true);
          setIsTodosLoadedError(false);
        }, 3000);
      });
  }, []);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      setIsTitleError(true);
      setIsErrorHidden(false);

      return;
    }

    setIsTitleError(false);
    setIsErrorHidden(true);
    setIsInputDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    addTodo({ userId: USER_ID, title: todoTitle.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setIsTitleError(false);
        setIsErrorHidden(true);
        setTodoTitle('');
      })
      .catch(() => {
        setIsRequestHasError(true);
        setIsErrorHidden(false);
        setTimeout(() => {
          setIsErrorHidden(true);
          setIsRequestHasError(false);
        }, 3000);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isTitleError) {
      timeoutId = setTimeout(() => {
        setIsTitleError(false);
        setIsErrorHidden(true);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [isTitleError]);

  function handleDeleteTodoCLick(todoId: number) {
    setIsDeletedTodoHasLoader(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(currTodo => todoId !== currTodo.id),
        );
      })
      .catch(() => {
        setIsErrorHidden(false);
        setIsDeletedRequestHasError(true);
        setTimeout(() => {
          setIsErrorHidden(true);
          setIsDeletedRequestHasError(false);
        }, 3000);
      })
      .finally(() => setIsDeletedTodoHasLoader(false));
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div
      className={classNames('todoapp', {
        'has-error': isTitleError || isRequestHasError,
      })}
    >
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              ref={inputRef}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        {areTodosExist && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            handleDeleteTodoClick={handleDeleteTodoCLick}
            isDeletedTodoHasLoader={isDeletedTodoHasLoader}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {areTodosExist && (
          <Footer
            notCompletedTodosCount={notCompletedTodosCount}
            selectedTodos={selectedTodos}
            setSelectedTodos={setSelectedTodos}
            isAnyCompletedTodos={isAnyCompletedTodos}
            setIsDeletedTodoHasLoader={setIsDeletedTodoHasLoader}
            completedIds={completedIds}
            setTodos={setTodos}
            setIsErrorHidden={setIsErrorHidden}
            setIsDeletedRequestHasError={setIsDeletedRequestHasError}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: isErrorHidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setIsErrorHidden(true);
            setIsTitleError(false);
            setIsRequestHasError(false);
            setIsTodosLoadedError(false);
          }}
        />
        {/* show only one message at a time */}
        {isTodosLoadedError && <p>Unable to load todos</p>}
        {isTitleError && 'Title should not be empty'}
        {isRequestHasError && <p>Unable to add a todo</p>}
        {isDeletedRequestHasError && 'Unable to delete a todo'}
      </div>
    </div>
  );
};
