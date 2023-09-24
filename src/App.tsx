/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import { TodoContex } from './utils/TodoContext';

const USER_ID = 11516;

const filterTodos = (todos: Todo[], filterStatus: Status): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContex);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage, isDisabled]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = filterTodos(todos, status);
  const handleFilterStatus = (todosStatus: Status) => (
    setStatus(todosStatus));

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle.length) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsDisabled(true);

    addTodo(newTodo)
      .then(response => {
        setTodos([...todos, response]);
        setNewTitle('');
        /* setIsDeletedTodo([...isDeletedTodo, response.id]); */
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
        /* setIsDeletedTodo([]); */
      });
  };

  const handledeleteTodo = (todoId: number) => {
    setIsDisabled(true);
    setIsLoading([...isLoading, todoId]);
    deleteTodo(todoId)
      .then(() => {
        const preparedTodos = [...todos]
          .filter(prevTodo => prevTodo.id !== todoId);

        setTodos(preparedTodos);
      })
      .catch(() => (
        setErrorMessage('Unable to delete a todo')
      ))
      .finally(() => {
        setIsDisabled(false);
        setIsLoading([]);
      });
  };

  const handledeleteAllSelectedTodos = () => {
    setIsDisabled(true);
    const selectedTodos = todos.filter(todo => todo.completed);

    selectedTodos.forEach(todo => (
      setIsLoading(prevArray => [...prevArray, todo.id])
    ));

    Promise.all(selectedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => (
        setErrorMessage('Unable to delete a todo')
      ))
      .finally(() => {
        setIsLoading([]);
        setIsDisabled(false);
      });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {activeTodosCount > 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className="todoapp__toggle-all active"
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
              disabled={isDisabled}
              ref={inputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              handledeleteTodo={handledeleteTodo}
              isDeletedTodo={isLoading}
              key={todo.id}
            />
          ))}

          {(tempTodo) && (
            <TodoItem
              todo={tempTodo}
              handledeleteTodo={handledeleteTodo}
              isDeletedTodo={isLoading}
              key={tempTodo.id}
            />
          )}
        </section>

        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} items left`}
            </span>
            <TodoFilter
              handleFilterStatus={handleFilterStatus}
              todosFilterStatus={status}
            />
            {/* Active filter should have a 'selected' class */}
            {/* don't show this button if there are no completed todos */}
            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={() => handledeleteAllSelectedTodos()}
              disabled={!hasCompleted}
              hidden={!hasCompleted}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
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
