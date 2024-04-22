/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { DispatchContext } from './store/store';
import { Header } from './component/Header/Header';
import { Footer } from './component/Footer/Footer';
import { TodoList } from './component/TodoList/TodoList';
import { TodoError } from './component/TodoError/TodoError';

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    async function downloadAllTodos() {
      try {
        const allTodos = await getTodos();

        dispatch({ type: 'setAllTodos', todos: allTodos });
      } catch (error) {
        // eslint-disable-next-line no-console
        dispatch({ type: 'setError', error: 'Unable to load todos' });
      }
    }

    downloadAllTodos();
  }, [dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {/* Hide the footer if there are no todos */}
        <Footer />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoError />
    </div>
  );
};
