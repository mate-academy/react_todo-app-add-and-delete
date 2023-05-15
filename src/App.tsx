/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import { useTodoContext } from './context/TodoContext';
import { getTodos } from './api/todos';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { FooterFilter } from './components/FooterFilter';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 10407;

export const App: React.FC = () => {
  const {
    todos,
    error,
    setTodos,
    setError,
  } = useTodoContext();

  const loadTodos = async () => {
    try {
      setError(null);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.LOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <TodoForm />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todos.length} items left`}
              </span>

              <FooterFilter />
            </footer>

          </>
        )}
      </div>

      {error && <ErrorMessage />}
    </div>
  );
};
