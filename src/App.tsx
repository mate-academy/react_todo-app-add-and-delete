/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  createTodos,
  deleteTodos,
  UpdateTodo,
  // EditTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { ToDo } from './components/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState<Todo | null>(null);
  const [errorAdd, setErrorAdd] = useState(false);
  const [errorRemove, setErrorRemove] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(false);
  const [errorEmptyTitile, setErrorEmptyTitile] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [togglerSelectAll, setTogglerSelectAll] = useState(true);
  const [hidden, setHidden] = useState(true);
  const [edditing, setEdditing] = useState<Todo | null>(null);
  const editTitle = useRef<HTMLInputElement>(null);

  const selectTypeFiltred = (type:string) => {
    setTypeFilter(type);
  };

  const foundTodoList = (u:User) => {
    getTodos(u.id).then(response => {
      setTodoList(response);
      setIsAdding(null);
      setEdditing(null);
    });
  };

  const createTodo = async (event:any) => {
    event.preventDefault();
    if (!newTodoTitle) {
      setErrorEmptyTitile(true);
      setHidden(false);

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      };

      setIsAdding(newTodo);

      try {
        await createTodos(newTodo);
      } catch {
        setErrorAdd(true);
        setHidden(false);
        setIsAdding(null);
      }

      foundTodoList(user);
      setNewTodoTitle('');
    }
  };

  const selectComplited = async (todo:Todo) => {
    try {
      if (todo.completed) {
        await UpdateTodo(todo, false);
      } else {
        await UpdateTodo(todo, true);
      }
    } catch {
      setErrorUpdate(true);
      setHidden(false);
    }

    if (user) {
      foundTodoList(user);
    }
  };

  const selectAllTodos = () => {
    todoList.map(async (todo) => {
      if (!todo.completed && togglerSelectAll) {
        selectComplited(todo);
      } else if (todo.completed && !togglerSelectAll) {
        selectComplited(todo);
      }
    });

    setTogglerSelectAll(prefer => !prefer);
  };

  const clearCompletedTodo = () => {
    todoList.map(async (todo) => {
      if (todo.completed) {
        deleteTodos(todo);
        try {
          await deleteTodos(todo);
        } catch {
          setErrorRemove(true);
          setHidden(false);
        }

        if (user) {
          foundTodoList(user);
        }
      }
    });
  };

  useEffect(() => {
    if (user) {
      foundTodoList(user);
    }
  }, [user]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filtredList = todoList.filter(todo => {
    switch (typeFilter) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return todo;
    }
  });

  const handlerCloseErrors = () => {
    setHidden(true);
    setErrorAdd(false);
    setErrorRemove(false);
    setErrorUpdate(false);
    setErrorEmptyTitile(false);
  };

  useEffect(() => {
    setTimeout(handlerCloseErrors, 3000);
  }, [hidden]);

  const hasComplitedTodo = todoList.some(todo => todo.completed);
  const counterActiveTodos = todoList.filter(todo => !todo.completed).length;
  const allComplited = todoList.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allComplited,
            })}
            onClick={selectAllTodos}
          />

          <form
            onSubmit={createTodo}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filtredList.map(todo => (
            <ToDo
              todo={todo}
              foundTodoList={foundTodoList}
              setErrorUpdate={setErrorUpdate}
              setErrorRemove={setErrorRemove}
              editTitle={editTitle}
              setHidden={setHidden}
              edditing={edditing}
              setEdditing={setEdditing}
            />
          ))}

          {isAdding && (
            <ToDo
              todo={isAdding}
              foundTodoList={foundTodoList}
              setErrorUpdate={setErrorUpdate}
              setErrorRemove={setErrorRemove}
              editTitle={editTitle}
              setHidden={setHidden}
            />
          )}
        </section>

        {!!todoList.length && (
          <>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${counterActiveTodos} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={
                    classNames('filter__link', {
                      'filter__link selected': typeFilter === 'All',
                    })
                  }
                  onClick={() => selectTypeFiltred('All')}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={
                    classNames('filter__link', {
                      'filter__link selected': typeFilter === 'Active',
                    })
                  }
                  onClick={() => selectTypeFiltred('Active')}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={
                    classNames('filter__link', {
                      'filter__link selected': typeFilter === 'Completed',
                    })
                  }
                  onClick={() => selectTypeFiltred('Completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className={classNames(
                  'todoapp__clear-completed hide', {
                    hidden: !hasComplitedTodo,
                  },
                )}
                onClick={clearCompletedTodo}
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
          'notification is-danger is-light has-text-weight-normal', {
            hidden,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handlerCloseErrors}
        />

        {
          (errorEmptyTitile && 'Title can\'t be empty')
          || (errorAdd && 'Unable to add a todo')
          || (errorRemove && 'Unable to delete a todo')
          || (errorUpdate && 'Unable to update a todo')
        }
      </div>
    </div>
  );
};
