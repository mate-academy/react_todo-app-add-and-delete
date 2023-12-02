/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => (
  <div className="todoapp">
    <h1 className="todoapp__title">todos</h1>

    <div className="todoapp__content">
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>

      <TodoList />

      <Footer />
    </div>

    <ErrorNotification />
  </div>
);
