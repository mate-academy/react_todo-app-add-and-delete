/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import cn from 'classnames';
import * as todoService from './api/todos';

enum SelectedFilter {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

const ERROR_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoItem, setTodoItem] = useState<Todo | null>(null);

  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<SelectedFilter>(SelectedFilter.ALL);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(false);

  const [loadingIds, setLoadingIds] = useState<number[]>([0]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabledInput && inputRef.current && loadingIds) {
      inputRef.current.focus();
    }
  }, [isDisabledInput, loadingIds]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), ERROR_DELAY);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case SelectedFilter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case SelectedFilter.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filter, todos]);

  const isOneActive = () => {
    return todos.filter(todo => todo.completed);
  };

  const isAllActive = () => {
    for (const todo of todos) {
      if (!todo.completed) {
        return false;
      }
    }

    return true;
  };

  const getIdOfCompletedTodos = () => {
    const completedId = [];

    for (const todo of todos) {
      if (todo.completed) {
        completedId.push(todo.id);
      }
    }

    return completedId;
  };

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setIsDisabledInput(true);

    setTodoItem({
      id: 0,
      title: title,
      userId: todoService.USER_ID,
      completed: false,
    });

    todoService
      .addTodo({ title, userId, completed })
      .then(newPost => {
        setTodos(prev => [...prev, newPost]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setIsDisabledInput(false);
        setTimeout(() => setErrorMessage(''), ERROR_DELAY);
      })
      .finally(() => {
        setTodoItem(null);
        setIsDisabledInput(false);
      });
  };

  async function deleteTodo(todoId: number) {
    setLoadingIds([...loadingIds, todoId]);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => setErrorMessage(''), ERROR_DELAY);
    } finally {
      setLoadingIds(loadingIds.filter(id => id !== todoId));
    }
  }

  const massDelete = async (todoIds: number[]) => {
    // console.log(loadingIds);
    setLoadingIds([...loadingIds, ...todoIds]);
    await Promise.all(
      todoIds.map(todoId => {
        deleteTodo(todoId);
      }),
    );
    // setLoadingIds(loadingIds.filter(id => !todoIds.includes(id)));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim()) {
      addTodo({
        title: query.trim(),
        userId: todoService.USER_ID,
        completed: false,
      });
    } else {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), ERROR_DELAY);
    }
  };

  const handleChangeCheckbox = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const itemsLeft = () => {
    const leftItems = todos.length - isOneActive().length;

    return `${leftItems} ${leftItems === 1 ? 'item' : 'items'} left`;
  };

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllActive(),
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isDisabledInput}
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map((todo: Todo) => (
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onClick={() => handleChangeCheckbox(todo.id)}
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
                x
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': loadingIds.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {todoItem !== null && (
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todoItem.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todoItem.title}
              </span>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': loadingIds.includes(todoItem.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}

          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}

          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                // value="Todo is being edited now"
                // remove error from console
                defaultValue="Todo is being edited now"
              />
            </form> */}

          {/* <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is in loadind state */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              x
            </button> */}

          {/* 'is-active' class puts this modal on top of the todo */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        </section>
        {/* Hide the footer if there are no todos */}
        {(todos.length !== 0 || todoItem) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft()}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filter === SelectedFilter.ALL,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(SelectedFilter.ALL)}
              >
                {SelectedFilter.ALL}
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === SelectedFilter.ACTIVE,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(SelectedFilter.ACTIVE)}
              >
                {SelectedFilter.ACTIVE}
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === SelectedFilter.COMPLETED,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(SelectedFilter.COMPLETED)}
              >
                {SelectedFilter.COMPLETED}
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => massDelete(getIdOfCompletedTodos())}
            >
              {isOneActive().length > 0 && 'Clear completed'}
            </button>
          </footer>
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
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

        {/* this error messages will used in the next part of task */}
        {/* Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
      </div>
    </div>
  );
};
