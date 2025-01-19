/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { FilterMethods } from './types/Methods';
import { Error } from './components/Error';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { getTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [filterMethod, setFilterMethod] = useState<FilterMethods>(
    FilterMethods.All,
  );
  const [loadTodo, setLoadTodo] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(loadedTodos => {
        if (loadedTodos.length === 0) {
          setError('You don’t have todos at all!');
        } else {
          setTodos(loadedTodos);
        }

        setError(null);
      })
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const countOfItemsLeft = (elements: Todo[]) => {
    const filtered = elements.filter(el => el.completed === false);

    return filtered.length;
  };

  function filterTodos(elements: Todo[], method: FilterMethods): Todo[] {
    let copyForFilter = [...elements];

    if (method === FilterMethods.All) {
      return elements;
    }

    if (method === FilterMethods.Active) {
      copyForFilter = copyForFilter.filter(el => !el.completed);
    }

    if (method === FilterMethods.Completed) {
      copyForFilter = copyForFilter.filter(el => el.completed);
    }

    return copyForFilter;
  }

  const visibleTodos = filterTodos(todos, filterMethod);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      {loading && (
        <div className="global-loader">
          <div className="loader"></div>
        </div>
      )}

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={setError}
          formValue={formValue}
          onTodos={setTodos}
          changeFormValue={setFormValue}
          setloadTodo={setLoadTodo}
          inputRef={inputRef}
          handeFocus={handleFocus}
        />

        <Main
          todos={visibleTodos}
          tempTodo={loadTodo}
          newError={setError}
          renderTodos={setTodos}
          setDeleting={setDeleting}
          deleting={deleting}
          handleFocus={handleFocus}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            checkCount={countOfItemsLeft}
            setFilter={setFilterMethod}
            todos={todos}
            filterMethod={filterMethod}
            renderTodos={setTodos}
            setDeleting={setDeleting}
            newError={setError}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Error error={error} />
    </div>
  );
};
