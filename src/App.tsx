/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos, addTodo, markDone, removeTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isHidden, setIsHidden] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notCompleted, setNotCompleted] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<any>({ title: null });
  const [activeTodo, setActiveTodo] = useState(true);
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setTodoTitle('');
    const addNewTodo = async (data: Omit<Todo, 'id'>) => {
      try {
        const todo = await addTodo(data);

        setTodos((currentTodos): any => [...currentTodos, todo]);
        setTempTodo({ title: null });
      } catch {
        setErrorMessage('Unable to add a todo');
        setIsHidden(false);
        setTempTodo({ title: null });
      }
    };

    if (user === null) {
      return;
    }

    if (todoTitle === '') {
      setErrorMessage('Title can\'t be empty');
      setIsHidden(false);
    }

    if (todoTitle !== '') {
      setTempTodo({
        title: todoTitle,
      });
      addNewTodo({
        userId: user.id,
        title: todoTitle,
        completed: false,
      });
    }
  };

  const hideError = () => {
    setIsHidden(true);
  };

  const getFilter = (value: string) => {
    setFilterStatus(value);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodosUser = async () => {
    if (user === null) {
      return;
    }

    setIsAdding(true);

    try {
      const todosUser = await getTodos(user.id);

      switch (filterStatus) {
        case 'all':
          setTodos(todosUser);
          setNotCompleted((
            todosUser.filter(
              todo => todo.completed === false,
            )).length);
          break;

        case 'active':
          setTodos(todosUser.filter(todo => todo.completed === false));
          break;

        case 'completed':
          setTodos(todosUser.filter(todo => todo.completed === true));
          break;

        default:
          break;
      }

      setIsAdding(false);
      const isTodo = todos.some(todo => todo.completed === true);

      setActiveTodo(isTodo);
    } catch (error) {
      setErrorMessage('Unable load todos');
      setIsHidden(false);
    }
  };

  const handleRemoveTodo = async (id: number) => {
    const removeTodoById = async (idTodo: number) => {
      try {
        await removeTodo(idTodo);
        loadTodosUser();
      } catch {
        setErrorMessage('Unable to delete a todo');
        setIsHidden(false);
      }
    };

    removeTodoById(id);
  };

  const handleClick = async (id: number, completed: boolean) => {
    await markDone(id, { completed: !completed });
    loadTodosUser();
    // setActiveTodo(!(todos.some(todo => todo.completed === true)));
  };

  const removeAllDone = () => {
    const completed = todos.filter(todo => todo.completed === true);
    // console.log(completed);

    // eslint-disable-next-line no-restricted-syntax
    for (const todo of completed) {
      handleRemoveTodo(todo.id);
    }
  };

  // load todo, filter todo
  useEffect(() => {
    loadTodosUser();
    // setActiveTodo(!(todos.some(todo => todo.completed === true)));
  }, [filterStatus]);

  // hide error after 3 sec
  useEffect(() => {
    const hide = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    return () => clearTimeout(hide);
  }, [isHidden]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={onChange}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.length > 0
            && (
              todos.map(todo => (
                <div
                  data-cy="Todo"
                  className={
                    classNames('todo', {
                      completed: todo.completed,
                    })
                  }
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      onClick={() => handleClick(todo.id, todo.completed)}
                    />
                  </label>

                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => handleRemoveTodo(todo.id)}
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              ))
            )}
          {tempTodo.title !== null
          && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title || null}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
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
        {/* <section className="todoapp__main" data-cy="TodoList">
          <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">HTML</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">CSS</span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue="JS"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">React</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">Redux</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </section> */}

        {todos.length !== 0
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${notCompleted} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={
                  classNames('filter__link', {
                    selected: filterStatus === 'all',
                  })
                }
                onClick={() => getFilter('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={
                  classNames('filter__link', {
                    selected: filterStatus === 'active',
                  })
                }
                onClick={() => getFilter('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={
                  classNames('filter__link', {
                    selected: filterStatus === 'completed',
                  })
                }
                onClick={() => getFilter('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={activeTodo}
              onClick={removeAllDone}
            >
              Clear completed
            </button>
          </footer>
        )}

        {/* <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            4 items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          >
            Clear completed
          </button>
        </footer> */}
      </div>

      <div
        data-cy="ErrorNotification"
        className={
          classNames('notification is-danger is-light has-text-weight-normal', {
            'hidden ': isHidden,
          })
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
