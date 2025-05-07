/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  statusCompletedUpdate,
  titleUpdate,
  USER_ID,
} from './api/todos';
import { TodoItem } from './component/TodoItem';

const TIME = 3000;

type ErrorWithId = {
  id: number;
  message: string;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loader, setLoader] = useState<number[]>([]);
  const [inEdition, setInEdition] = useState<number | null>(null);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState<ErrorWithId[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  const setErrorHandle = useCallback((message: string) => {
    const id = Date.now();
    const newError: ErrorWithId = {
      id,
      message,
    };

    setError(erros => [...erros, newError]);
    setTimeout(
      () => setError(erros => erros.filter(erro => erro.id !== id)),
      TIME,
    );
  }, []);

  const keyPressHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const todo = newTodo.trim();

        event.preventDefault();

        if (!todo) {
          setErrorHandle('Title should not be empty');

          return;
        }

        setDisableForm(true);
        const tempId = -(todos.length + 1);

        // Adicione o todo temporário como não completado
        setTodos(prev => [
          ...prev,
          {
            id: tempId,
            userId: USER_ID,
            title: todo,
            completed: false,
          },
        ]);
        setLoader([tempId]);

        createTodo(todo)
          .then(res => {
            setTodos(prev => prev.map(t => (t.id === tempId ? res : t)));
            setNewTodo('');
            setLoader([]);
            newTodoField.current?.focus();
          })
          .catch(() => {
            setErrorHandle('Unable to add a todo');
            setTodos(prev => prev.filter(t => t.id !== tempId));
            setLoader([]);
          })
          .finally(() => {
            setDisableForm(false);
          });
      }
    },
    [newTodo, todos, setErrorHandle],
  );

  const onChangeHandler = useCallback(
    (id: number) => {
      setLoader(prev => [...prev, id]);
      const todoToUpdate = todos.find(todo => todo.id === id);
      const newCompletedStatus = !todoToUpdate?.completed;

      statusCompletedUpdate(id, newCompletedStatus)
        .then(() => {
          setTodos(prev =>
            prev.map(todo =>
              todo.id === id
                ? { ...todo, completed: newCompletedStatus }
                : todo,
            ),
          );
        })
        .catch(() => {
          setErrorHandle('Unable to update a todo');
        })
        .finally(() => {
          setLoader(prev => prev.filter(num => num !== id));
        });
    },
    [todos, setErrorHandle],
  );

  const getEditionKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.currentTarget.blur();
      } else if (event.key === 'Escape') {
        setInEdition(null);
        setEditingTitle('');
      }
    },
    [],
  );

  const filteredTodos: Todo[] = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const getDeleteHandler = useCallback(
    (id: number) => {
      setLoader(prev => [...prev, id]);

      deleteTodo(id)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== id));
          newTodoField.current?.focus();
        })
        .catch(() => {
          setErrorHandle('Unable to delete a todo');
        })
        .finally(() => {
          setLoader(prev => prev.filter(num => num !== id));
        });
    },
    [setErrorHandle],
  );

  const getEditionTitleHandler = useCallback(
    (id: number) => {
      const title = editingTitle.trim();

      if (!title) {
        setErrorHandle('Title should not be empty');
        getDeleteHandler(id);

        return;
      }

      const todoToUpdate = todos.find(todo => todo.id === id);

      if (title === todoToUpdate?.title) {
        setInEdition(null);
        setEditingTitle('');

        return;
      }

      setLoader(prev => [...prev, id]);
      titleUpdate(id, title)
        .then(() => {
          setTodos(prev =>
            prev.map(todo => (todo.id === id ? { ...todo, title } : todo)),
          );
        })
        .catch(() => {
          setErrorHandle('Unable to update a todo');
        })
        .finally(() => {
          setLoader(prev => prev.filter(num => num !== id));
          setInEdition(null);
          setEditingTitle('');
        });
    },
    [editingTitle, todos, setErrorHandle, getDeleteHandler],
  );

  const getTodosHandler = useCallback(() => {
    getTodos()
      .then(res => setTodos(res))
      .catch(() => setErrorHandle('Unable to load todos'));
  }, [setErrorHandle]);

  const clearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setLoader(prev => [...prev, ...completedIds]);

    const deletionPromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));

          return true;
        })
        .catch(() => {
          setErrorHandle('Unable to delete a todo');

          return false;
        }),
    );

    Promise.all(deletionPromises).finally(() => {
      setLoader(prev => prev.filter(id => !completedIds.includes(id)));
      newTodoField.current?.focus();
    });
  }, [todos, setErrorHandle]);

  useEffect(() => {
    getTodosHandler();
  }, [getTodosHandler]);

  useEffect(() => {
    if (!disableForm && newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [disableForm]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => {
                const allCompleted = todos.every(todo => todo.completed);

                todos.forEach(todo => {
                  if (todo.completed !== !allCompleted) {
                    onChangeHandler(todo.id);
                  }
                });
              }}
            />
          )}

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setNewTodo(event.target.value)}
              onKeyDown={keyPressHandler}
              disabled={disableForm}
              value={newTodo}
              ref={newTodoField}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              loader={loader}
              inEdition={inEdition}
              editingTitle={editingTitle}
              onChangeHandler={onChangeHandler}
              setInEdition={setInEdition}
              setEditingTitle={setEditingTitle}
              getEditionKeyDownHandler={getEditionKeyDownHandler}
              getEditionTitleHandler={getEditionTitleHandler}
              getDeleteHandler={getDeleteHandler}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed && todo.id > 0).length}{' '}
              items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={
                todos.filter(todo => todo.completed).length === 0 ||
                loader.some(id => todos.some(t => t.id === id && t.completed))
              }
              style={{
                visibility: todos.some(todo => todo.completed)
                  ? 'visible'
                  : 'hidden',
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          error.length === 0 ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError([])}
        />
        {error.map(err => (
          <div key={err.id}>{err.message}</div>
        ))}
      </div>
    </div>
  );
};
