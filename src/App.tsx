/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, postTodos, deleteTodo, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
// import { todoFilter } from './components/FilterTodos';

const USER_ID = 10327;

export const App: React.FC = () => {
  const [todoItem, setTodoItem] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [isActive, setIsActive] = useState(false);

  const fetchTodos = () => getTodos(USER_ID).then(setTodos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const clearTodoField = () => setTodoItem('');

  const createTodo = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const newTodo = {
      userId: USER_ID,
      title: todoItem,
      completed: false,
    };

    postTodos(USER_ID, newTodo);
    fetchTodos();
    clearTodoField();
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
    fetchTodos();
  };

  const handleChangeTodo = (id: number, isCompleted: boolean) => {
    patchTodo(id, { completed: !isCompleted });
    fetchTodos();
  };

  console.log(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form
            onSubmit={createTodo}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoItem}
              onChange={event => setTodoItem(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={classNames('todo', {
                completed: todo.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onClick={() => handleChangeTodo(todo.id, todo.completed)}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            3 items left
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">
            <a href="#/" className="filter__link selected">
              All
            </a>

            <a href="#/active" className="filter__link">
              Active
            </a>

            <a href="#/completed" className="filter__link">
              Completed
            </a>
          </nav>

          {/* don't show this button if there are no completed todos */}
          <button type="button" className="todoapp__clear-completed">
            Clear completed
          </button>
        </footer>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className="notification is-danger is-light has-text-weight-normal">
        <button type="button" className="delete" />

        {/* show only one message at a time */}
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
