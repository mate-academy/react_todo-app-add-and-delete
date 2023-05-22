/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useContext } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { TodoContext } from './contexts/TodoContext';
import { FormToAddTodo } from './components/FormToAddTodo';
import { USER_ID } from './constants/USER_ID';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setError,
  } = useContext(TodoContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => setTodos(response))
      .catch(() => setError('Unable to fetch todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
          />

          <FormToAddTodo />
        </header>

        <TodoList />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <Error />
    </div>
  );
};
