/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/Auth/ErrorNotification';
import { TodoList } from './components/Auth/TodoList';
import { Footer } from './components/Auth/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todosAreLoaded, setTodosAreLoaded] = useState(false);
  const [error, setError] = useState<Error>(Error.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding] = useState(false);

  const resetError = () => {
    setTimeout(() => {
      setError(Error.NONE);
    }, 3000);
  };

  const setTodos = async () => {
    try {
      const userId = user ? user.id : 1;
      const todosFromApi = await getTodos(userId);

      setVisibleTodos(todosFromApi);
      setTodosAreLoaded(true);
    } catch (err) {
      setError(Error.ADD);

      resetError();
    }
  };

  // eslint-disable-next-line no-console
  console.log(isAdding);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setTodos();
  }, []);

  const filteredTodos = visibleTodos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosAreLoaded && (
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
              value={todoTitle}
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleChange}
            />
          </form>
        </header>
        {todosAreLoaded && (
          <>
            <TodoList todos={filteredTodos} />
            <Footer filter={filter} setFilter={setFilter} />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
