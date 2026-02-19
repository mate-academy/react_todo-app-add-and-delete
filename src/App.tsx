/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import classNames from 'classnames';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingsIds, setLoadingsIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasCompleted = todos.some(todo => todo.completed);

  const countOfTodos = todos.filter(
    todo => !todo.completed && todo.id !== 0).length;

  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
        return true;
    }
  });

  const handleFilterChange = (type: Filter) => {
    setFilter(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMessage(null);
    e.preventDefault();
    if (!value.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    setTodos(prev => [...prev, temp]);
    setLoadingsIds(prev => [...prev, 0]);

    try {
      const newTodo = await createTodo({
        userId: USER_ID,
        title: value.trim(),
        completed: false,
      });

      setTodos(prev => prev.map(todo => (todo.id === 0 ? newTodo : todo)));

      setValue('');
    } catch (error) {
      setTodos(prev => prev.filter(todo => todo.id !== 0));
      setErrorMessage('Unable to add a todo');
    } finally {
      setLoadingsIds(prev => prev.filter(id => id !== 0));

      setTimeout(() => {
        inputFocusRef.current?.focus();
      }, 0);
    }
  };

  const handleRemoveButton = async (id: number) => {
    setLoadingsIds(prev => [...prev, id]);
    try {
      await Promise.all([
        deleteTodo(id),
        new Promise(resolve => setTimeout(resolve, 500)),
      ]);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setLoadingsIds(prev => prev.filter(itemId => itemId !== id));

      setTimeout(() => {
        inputFocusRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    if (results.some(result => result.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

    setTimeout(() => {
      inputFocusRef.current?.focus();
    }, 0);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className="todoapp__toggle-all"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputFocusRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={e => setValue(e.target.value)}
              disabled={loadingsIds.includes(0)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleRemoveButton={handleRemoveButton}
              loadingsIds={loadingsIds}
            />

            <Footer
              onFilterChange={handleFilterChange}
              hasCompleted={hasCompleted}
              handleClearCompleted={handleClearCompleted}
              countOfTodos={countOfTodos}
              filter={filter}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
