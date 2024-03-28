/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FILTERS, USER_ID } from './utils/constants';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './services/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(FILTERS[0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[] | null>(null);

  const visibleTodos = useMemo(() => todos.filter(filter.fn), [todos, filter]);
  const timerId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function showError(message: string) {
    window.clearTimeout(timerId.current);

    setErrorMessage(message);

    if (!message) {
      return;
    }

    timerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  }

  function loadTodos() {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }

  function deleteTodoItem(id: number) {
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setUpdatingIds(null);
        inputRef.current?.focus();
      });

    setUpdatingIds(prevIds => (prevIds !== null ? [...prevIds, id] : [id]));
  }

  function clearCompleted() {
    const completedIds = todos.flatMap(({ id, completed }) =>
      completed ? id : [],
    );

    setUpdatingIds([...completedIds]);

    completedIds.forEach(id => {
      deleteTodo(id)
        .then(() => {
          setTodos(items => items.filter(({ id: itemId }) => itemId !== id));
        })
        .catch(() => {
          showError('Unable to delete a todo');
        })
        .finally(() => {
          setUpdatingIds(null);
          inputRef.current?.focus();
        });
    });
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadTodos();

    onhashchange = () => {
      const { hash } = new URL(window.location.href);

      const foundedFilter =
        FILTERS.find(({ hash: filterHash }) => filterHash === hash) ||
        FILTERS[0];

      setFilter(foundedFilter);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={showError}
          setTodos={setTodos}
          saveTempTodo={setTempTodo}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          deleteItem={deleteTodoItem}
          updatingIds={updatingIds}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            activeFilter={filter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} showError={showError} />
    </div>
  );
};
