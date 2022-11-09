/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthProvider, AuthContext } from './components/Auth/AuthContext';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList';
import { StatusProvider } from './components/StatusContext';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState< Todo[]>([]);

  const loadTodos = async () => {
    if (user?.id) {
      const gettodos = await getTodos(user.id);

      setTodos(gettodos);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                data-cy="ToggleAllButton"
                type="button"
                className="todoapp__toggle-all active"
              />
            )}

            <form>
              <input
                data-cy="NewTodoField"
                type="text"
                ref={newTodoField}
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
              />
            </form>
          </header>

          <StatusProvider>
            <TodoList todos={todos} />
          </StatusProvider>

          {todos.length > 0 && (
            <Footer todos={todos} />
          )}
        </div>

        <Error />
      </div>
    </AuthProvider>
  );
};
