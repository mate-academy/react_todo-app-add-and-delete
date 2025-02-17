/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as Server from './api/todos';
import cn from 'classnames';

const filterTodos = (todos: Todo[], filter: string) => {
  switch (filter) {
    case 'All':
      return todos;

    case 'Active':
      return [...todos].filter(el => !el.completed);

    case 'Completed':
      return [...todos].filter(el => el.completed);

    default:
      return;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ActiveChangeId, setActiveChangeId] = useState(0);
  const [editedTodo, setEditedTodo] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('All');
  const [errors, setErrors] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number[] | null>(null);

  const zeroIdElement = {
    id: 0,
    userId: USER_ID,
    title: newTodo.trim(),
    completed: false,
  };

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  });

  function getData() {
    const fetchedTodos = async () => {
      try {
        const list = await getTodos();

        setTodos(list);
      } catch (error) {
        setErrors('Unable to load todos');
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    };

    fetchedTodos();
  }

  useEffect(() => {
    getData();
  }, []);

  function loseFocus(id: number) {
    if (todos) {
      setTodos(
        todos?.map(el => {
          if (el.id === ActiveChangeId && editedTodo) {
            return { ...el, title: editedTodo };
          }

          return el;
        }),
      );
    }

    setEditedTodo('');
    setActiveChangeId(id);
  }

  const deleteCompleted = async (idList: number[]) => {
    idList.map(async id => {
      try {
        setDeletingId(idList);
        await Server.deletePost(id);
        await setTodos(list => list.filter(el => el.id !== id));
      } catch {
        setErrors('Unable to delete a todo');
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    });

    setDeletingId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId([id]);
      await Server.deletePost(id);
      setTodos(todos.filter(el => el.id !== id));
    } catch (error) {
      setDeletingId(null);
      setErrors('Unable to delete a todo');
      setTimeout(() => {
        setErrors('');
      }, 3000);
    }
  };

  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (newTodo.trim()) {
      event.preventDefault();
      const todo = {
        id: Date.now(),
        userId: USER_ID,
        title: newTodo.trim(),
        completed: false,
      };

      try {
        setTempTodo(zeroIdElement);
        const a = await Server.createPost(todo);

        setTodos([...todos, a]);
        setNewTodo('');
      } catch {
        setErrors('Unable to add a todo');
        setTimeout(() => {
          setErrors('');
        }, 3000);
      } finally {
        setTempTodo(null);
      }
    } else {
      setErrors('Title should not be empty');
      setTimeout(() => {
        setErrors('');
      }, 3000);
    }
  };

  const hendleEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      loseFocus(0);
    }

    if (event.key === 'Escape') {
      setActiveChangeId(0);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={() =>
              setTodos(
                todos.map(el => {
                  if (
                    todos.filter(todo => todo.completed).length === todos.length
                  ) {
                    return { ...el, completed: !el.completed };
                  } else {
                    return { ...el, completed: true };
                  }
                }),
              )
            }
          />

          {/* Add a todo on form submit */}
          <form onSubmit={event => event.preventDefault()}>
            <input
              ref={ref}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              onKeyDown={handleSubmit}
              disabled={Boolean(tempTodo)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos?.map(todo => (
            <div
              data-cy="Todo"
              className={`todo ${cn({ completed: todo.completed })}`}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onClick={() =>
                    setTodos(
                      todos.map(el => {
                        if (el.id === todo.id) {
                          return { ...el, completed: !el.completed };
                        }

                        return el;
                      }),
                    )
                  }
                  defaultChecked={todo.completed}
                />
              </label>

              {ActiveChangeId !== todo.id ? (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setActiveChangeId(todo.id);
                    setEditedTodo(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              ) : (
                <form onSubmit={event => event.preventDefault()}>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder={todo.title}
                    value={editedTodo}
                    onChange={event => setEditedTodo(event.target.value)}
                    onBlur={() => loseFocus(0)}
                    onKeyDown={hendleEdit}
                    autoFocus
                  />
                </form>
              )}

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${cn({ 'is-active': deletingId?.includes(todo.id) })}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {/* This todo is an active todo */}

          {/* This todo is in loadind state */}
          {Boolean(tempTodo) && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {zeroIdElement.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(el => !el.completed).length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${cn({ selected: filter === 'All' })}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${cn({ selected: filter === 'Active' })}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${cn({ selected: filter === 'Completed' })}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() =>
                deleteCompleted(
                  todos
                    .filter(el => {
                      if (el.completed) {
                        return true;
                      }
                    })
                    .map(el => el.id),
                )
              }
              disabled={todos.every(el => !el.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn({
          'notification is-danger is-light has-text-weight-normal': errors,
          hidden: !errors,
        })}
      >
        {errors && (
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrors('')}
          />
        )}
        {/* Unable to load todos
        <br /> */}
        {errors}
        {/* <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
