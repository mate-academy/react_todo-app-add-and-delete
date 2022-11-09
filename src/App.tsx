import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Notifications } from './types/Notifications';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notification, setNotification] = useState<Notifications | ''>('');
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodoTitle, setTemporaryTodoTitle] = useState('');
  const [deletedTodosID, setDeletedTodosID] = useState<number[]>([]);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    async function fetchTodos() {
      if (user) {
        const loadedTodos = await getTodos(user.id);

        setTodos(loadedTodos);
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const createNotification = (message: Notifications) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const filterTodos = (option: Filter) => {
    switch (option) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      setTemporaryTodoTitle(title);
      setTitle('');
      const response = await createTodo(newTodo);
      const responseTodo = JSON.parse(JSON.stringify(response));

      const createdTodo = {
        id: responseTodo.id,
        userId: responseTodo.userId,
        title: responseTodo.title,
        completed: responseTodo.completed,
      };

      setTodos(currentTodos => ([...currentTodos, createdTodo]));
      setTemporaryTodoTitle('');
    } catch (e) {
      createNotification('Unable to add a todo');
    }

    setIsAdding(false);
  };

  const onDelete = async (todoId: number) => {
    setDeletedTodosID(current => ([...current, todoId]));

    try {
      await removeTodo(todoId);
      setDeletedTodosID(current => [...current].filter(id => id !== todoId));
      setTodos(
        currentTodo => ([...currentTodo.filter(todo => todo.id !== todoId)]),
      );
    } catch (e) {
      createNotification('Unable to delete a todo');
      setDeletedTodosID(current => [...current].filter(id => id !== todoId));
    }
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => onDelete(todo.id));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotification('');
    setIsAdding(true);

    if (!title) {
      createNotification('Title can\'t be empty');
      setIsAdding(false);

      return;
    }

    const newTodo = {
      userId: user ? user.id : 0,
      title,
      completed: false,
    };

    addTodo(newTodo);
  };

  const filteredTodos = filterTodos(filterType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="toggle-all-todos"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <div
                  data-cy="Todo"
                  className={classNames(
                    'todo',
                    { completed: todo.completed },
                  )}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
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
                    onClick={() => onDelete(todo.id)}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={classNames(
                      'modal overlay',
                      { 'is-active': deletedTodosID.includes(todo.id) },
                    )}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ))}
              {isAdding && (
                <div
                  data-cy="Todo"
                  className="todo"
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                    />
                  </label>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                  >
                    {temporaryTodoTitle}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === Filter.All },
                  )}
                  onClick={() => setFilterType(Filter.All)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === Filter.Active },
                  )}
                  onClick={() => setFilterType(Filter.Active)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === Filter.Completed },
                  )}
                  onClick={() => setFilterType(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={completedTodos.length === 0}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
      {notification && (
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !notification },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            aria-label="hide-notification"
            onClick={() => setNotification('')}
          />

          {notification}
        </div>
      )}
    </div>
  );
};
