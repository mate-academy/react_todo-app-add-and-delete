/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todosServices from './api/todos';
import { TodoStatus } from './types/TodoStatus';
import { USER_ID, FILTER_LINKS } from './utils/constants';
import { getFilteredTodo } from './utils/GetFilteredTodo';
import { TodoItem } from './Components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<TodoStatus>(TodoStatus.All);
  const [titleQuery, setTitleQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodoTitle, setTempTodoTitle] = useState<string | null>(null);

  const todoInput = useRef<HTMLInputElement | null>(null);
  const trimTitleQuery = titleQuery ? titleQuery.trim() : '';

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  });

  // console.log();


  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    todosServices
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  function deleteTodo(todoId: number) {
    setIsLoading(true);
    todosServices
      .deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTempTodoTitle(null);
        setIsLoading(false);
      });
  }

  async function addTodo({ userId, title, completed }: Todo) {
    try {
      setIsAddingTodo(true);
      setTempTodoTitle(title);

      const newTodo = await todosServices.createTodo({
        userId,
        title,
        completed,
      });

      if (typeof newTodo === 'object' && newTodo && 'id' in newTodo) {
        setTodos((currentTodos) => [...currentTodos, newTodo as Todo]);
        setTitleQuery('');

        setIsLoading(false);
      } else {
        throw new Error('Failed to create todo');
      }
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTitleQuery(tempTodoTitle as string);

      setIsLoading(false);
    } finally {
      setIsAddingTodo(false);
      setTempTodoTitle(null);
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (trimTitleQuery.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({
      id: 0,
      userId: USER_ID,
      title: trimTitleQuery,
      completed: false,
    });
  };

  async function handleOnClearComplete() {
    const completedTodos = todos.filter((todo) => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const deletePromises = completedTodos.map((todo) => {
        return todosServices
          .deleteTodo(todo.id)
          .then(() => {
            setTodos((prevTodos) => prevTodos
              .filter((currentTodo) => currentTodo.id !== todo.id));
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
          });
      });

      await Promise.all(deletePromises);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setTempTodoTitle(null);
    }
  }

  const activeTodoCount = todos.filter(todo => todo.completed === false).length;
  const completedTodoCount = todos.some(todo => todo.completed === true);

  const filteredTodos = useMemo(() => {
    return getFilteredTodo(todos, selectedStatus);
  }, [selectedStatus, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {!!activeTodoCount && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form
            onSubmit={handleSubmit}
          >
            <input
              ref={todoInput}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={titleQuery}
              onChange={(event) => {
                setTitleQuery(event.target.value);
              }}
              disabled={isAddingTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.length > 0 && filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': isLoading === true,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodoTitle !== null && (
            <TodoItem tempTodoTitle={tempTodoTitle} />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodoCount} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {FILTER_LINKS.map(link => (
                <a
                  key={link.status}
                  href={`#/${selectedStatus}`}
                  className={classNames('filter__link', {
                    selected: selectedStatus === link.status,
                  })}
                  data-cy={link.dataCy}
                  onClick={() => {
                    setSelectedStatus(link.status);
                  }}
                >
                  {link.text}
                </a>
              ))}
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className={classNames('todoapp__clear-completed', {
                hidden: !completedTodoCount,
              })}
              data-cy="ClearCompletedButton"
              onClick={handleOnClearComplete}
              disabled={!completedTodoCount}
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage.length === 0,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
