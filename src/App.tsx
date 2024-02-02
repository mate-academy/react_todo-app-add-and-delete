/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Status, Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

const USER_ID = 77;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorHidden, setErrorHidden] = useState(true);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [selectedStatus, setSelectedStatus] = useState(Status.all);
  // #region error handling
  const handleErrorHiding = () => {
    setErrorHidden(true);
  };

  useEffect(() => {
    setTimeout(handleErrorHiding, 3000);
  }, [errorMessage]);

  // #endregion

  function loadTodos() {
    setLoadingTodos(true);
    setErrorHidden(true);

    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setErrorHidden(false);
      })
      .finally(() => setLoadingTodos(false));
  }

  useEffect(loadTodos, []);

  const addTodo = ({
    title: currentTitle, completed, userId,
  }: Todo) => {
    const newTempTodo = {
      id: 0,
      title: currentTitle.trim(),
      completed,
      userId,
    };

    setErrorHidden(true);
    setErrorMessage('');
    setTempTodo(newTempTodo);

    if (!newTempTodo.title.trim()) {
      setErrorMessage('Title should not be empty');
      setTempTodo(null);
      setErrorHidden(false);

      return Promise.resolve();
    }

    return postService.createTodo({ title: currentTitle.trim(), completed, userId })
      .then((createdTodo) => {
        setTodos((prevTodos) => [
          ...prevTodos, createdTodo,
        ]);
        setTempTodo(null);
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        setErrorHidden(false);
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return postService.removeTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorHidden(false);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const deleteCompletedTodos = () => {
    const comnpletedTodoIds = todos.filter(todo => todo.completed).map(todo => todo.id);

    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));

    return postService.removeTodos(comnpletedTodoIds)
      .catch((error) => {
        setTodos(todos);
        setErrorHidden(false);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });
  };

  const visibleTodos = [...todos].filter((todo) => {
    switch (selectedStatus) {
      case Status.active:
        return !todo.completed;

      case Status.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((!loadingTodos || tempTodo === null) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loadingTodos, tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!activeTodos && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={tempTodo !== null}
              ref={inputRef}
            />
          </form>
        </header>
        {
          !loadingTodos
          && !!todos.length
          && (
            <TodoList
              todos={visibleTodos}
              setTodos={setTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
            />
          )
        }
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos} items left`}
            </span>

            <TodoFilter
              setSelectedStatus={setSelectedStatus}
              selectedStatus={selectedStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={deleteCompletedTodos}
              style={{ visibility: completedTodos > 0 ? 'visible' : 'hidden' }}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorHidden && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorHiding}
        />
        {errorMessage}
      </div>
    </div>
  );
};
