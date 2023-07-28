/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

type Field = 'all' | 'active' | 'completed';

const USER_ID = 11140;

export const App: React.FC = () => {
  const [todos, setTodos] = useState([] as Todo[]);
  const [initialTodos, setInitialTodos] = useState([] as Todo[]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedField, setSelectedField] = useState<Field>('all');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [updatedTitle, setUpdateTitle] = useState('');

  const loadTodos = () => getTodos(USER_ID)
    .then(someTodos => {
      setTodos(someTodos);
      setInitialTodos(someTodos);
    })
    .catch(() => setErrorMessage('Incorrect URL'));

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  let preparedTodos = [...todos];

  useMemo(() => {
    switch (selectedField) {
      case 'active':
        preparedTodos = preparedTodos.filter(todo => !todo.completed);
        break;

      case 'completed':
        preparedTodos = preparedTodos.filter(todo => todo.completed);
        break;

      default:
        preparedTodos = [...todos];
    }
  }, [todos, selectedField]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            onClick={() => {
              setTodos(someTodos => {
                const newTodos = [...someTodos]
                  .map(todo => {
                    const isSomeComplited = [...someTodos]
                      .filter(someTodo => someTodo.completed).length !== someTodos.length;

                    if (isSomeComplited) {
                      return { ...todo, completed: true };
                    }

                    return { ...todo, completed: false };
                  });

                return newTodos;
              });
            }}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              event.preventDefault();
              setTodos(prevTodos => [...prevTodos, {
                id: 0, title: inputTitle, completed: false, userId: USER_ID,
              }]);
              client.post(`/todos?userId=${USER_ID}`, { title: inputTitle, completed: false, userId: USER_ID })
                .then(loadTodos)
                .catch(() => setErrorMessage('Can\'t load a todo'));

              setInputTitle('');
            }}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setInputTitle(event.target.value)}
              value={inputTitle}
            />
          </form>
        </header>

        {preparedTodos && (
          <section className="todoapp__main">
            {/* This is a completed todo */}
            {preparedTodos.map(todo => (
              <div className={classNames('todo',
                { completed: todo.completed })}
              >
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onClick={() => {
                      setTodos(someTodos => {
                        const newTodos = [...someTodos];
                        // eslint-disable-next-line max-len
                        const index = someTodos.findIndex(t => t.id === todo.id);
                        const newTodo = { ...todo, completed: !todo.completed };

                        newTodos.splice(index, 1, newTodo);

                        return newTodos;
                      });
                    }}
                  />
                </label>
                {selectedTodo === todo
                  ? (
                    <form onSubmit={event => {
                      event.preventDefault();
                      setTodos(someTodos => {
                        const newTodos = [...someTodos];
                        // eslint-disable-next-line max-len
                        const index = someTodos.findIndex(t => t.id === todo.id);
                        const newTodo = {
                          ...todo, title: updatedTitle, id: 0,
                        };

                        newTodos.splice(index, 1, newTodo);

                        return newTodos;
                      });

                      client.patch(`/todos/${todo.id}?userId=${USER_ID}`, { title: updatedTitle })
                        .then(loadTodos)
                        .catch(() => setErrorMessage('Can\'t update a todo'));

                      setSelectedTodo(null);
                    }}
                    >
                      <input
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={updatedTitle}
                        onChange={(event) => {
                          event.preventDefault();
                          setUpdateTitle(event.target.value);
                        }}
                        onBlur={event => {
                          event.preventDefault();
                          setTodos(someTodos => {
                            const newTodos = [...someTodos];
                            // eslint-disable-next-line max-len
                            const index = someTodos.findIndex(t => t.id === todo.id);
                            const newTodo = {
                              ...todo, title: updatedTitle, id: 0,
                            };

                            newTodos.splice(index, 1, newTodo);

                            return newTodos;
                          });

                          client.patch(`/todos/${todo.id}?userId=${USER_ID}`, { title: updatedTitle })
                            .then(loadTodos)
                            .catch(() => setErrorMessage('Can\'t update a todo'));

                          setSelectedTodo(null);
                        }}
                        autoFocus
                      />
                    </form>
                  ) : (
                    <div
                      className="todo__title"
                      onDoubleClick={() => {
                        setSelectedTodo(todo);
                        setUpdateTitle(todo.title);
                      }}
                    >
                      {todo.id !== 0
                        ? todo.title
                        : (
                          <span className="loader" />
                        )}
                    </div>
                  )}
                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    client.delete(`/todos/${todo.id}?userId=${USER_ID}`);
                    setTodos(someTodos => {
                      const filteredTodos = [...someTodos].filter(t => t.id !== todo.id);

                      setInitialTodos(filteredTodos);

                      return filteredTodos;
                    });
                  }}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being updated */}
                {/* {todo.id !== 0
                  ? (
                    <div className="modal overlay">
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  ) : (
                    <>
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </>
                  )} */}
              </div>
            ))}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {preparedTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${initialTodos.length - todos
                .filter(t => t.completed).length}
                items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedField === 'all',
                })}
                onClick={(event) => {
                  event?.preventDefault();
                  setSelectedField('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedField === 'active',
                })}
                onClick={(event) => {
                  event?.preventDefault();
                  setSelectedField('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedField === 'completed',
                })}
                onClick={(event) => {
                  event?.preventDefault();
                  setSelectedField('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className={classNames('todoapp__clear-completed', {
                'is-invisible': todos.filter(t => t.completed).length === 0,
              })}
              onClick={() => {
                setTodos(someTodos => {
                  const newTodos = [...someTodos].filter(todo => !todo.completed);

                  [...someTodos]
                    .filter(todo => todo.completed)
                    .map(todo => client.delete(`/todos/${todo.id}?userId=${USER_ID}`));

                  setInitialTodos(newTodos);

                  return newTodos;
                });
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <div
        // eslint-disable-next-line max-len
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
          {/* show only one message at a time
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        </div>
      ) }
    </div>
  );
};
