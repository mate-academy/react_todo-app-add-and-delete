import React from 'react';
import cn from 'classnames';
import { useTodoContext } from './context/TodoContext';

import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { TodoForm } from './components/TodoForm/TodoForm';
import { NotificationModal } from './components/Notification/Notification';

export const App: React.FC = () => {
  const { todos, nrOfActiveTodos, toggleAll } = useTodoContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {(todos.length > 0) && (
            <button
              type="button"
              className={
                cn('todoapp__toggle-all',
                  { active: nrOfActiveTodos === todos.length })
              }
              aria-label="Toggle between active and not active"
              onClick={toggleAll}
            />
          )}

          <TodoForm />
        </header>

        <section className="todoapp__main">
          <TodoList />
        </section>

        {todos.length > 0 && (
          <TodoFooter />
        )}
      </div>

      <NotificationModal />
    </div>
  );
};
