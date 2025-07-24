import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, USER_ID } from './api/todos';
import { Header } from './components/header';
import { MainSection } from './components/mainSection';
import { Todo } from './types/Todo';
import { Footer } from './components/footer';

export const App: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [isError, setIsError] = useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const hideErrorMessage = () => {
    setTimeout(() => {
      setIsError(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setIsError('Unable to load todos');
        hideErrorMessage();
      });
  }, [date]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addNewTodoFromInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setIsError('Title should not be empty');
      hideErrorMessage();

      return;
    }

    const tempId = Date.now();

    const tempTodo: Todo = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);
    setLoadingTodoIds(prev => [...prev, tempId]);

    // ✅ додай тимчасовий todo в DOM одразу
    setTodos(prevTodos => [...prevTodos, tempTodo]);

    addTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(todo => {
        // ✅ заміни tempTodo на справжній todo
        setTodos(prevTodos => prevTodos.map(t => (t.id === tempId ? todo : t)));

        setDate(new Date());

        setLoadingTodoIds(prev =>
          prev.filter(id => id !== tempId).concat(todo.id),
        );

        setTimeout(() => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todo.id));
          setTitle('');
          setIsInputDisabled(false);
        }, 500);
      })
      .catch(() => {
        setIsError('Unable to add todo');
        hideErrorMessage();

        // ❌ прибери tempTodo, бо не вдалося додати
        setTodos(prevTodos => prevTodos.filter(t => t.id !== tempId));
        setLoadingTodoIds(prev => prev.filter(id => id !== tempId));
        setIsInputDisabled(false);
      });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') {
      return todo.completed;
    } else if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'all') {
      return todo;
    }

    return todo;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          addNewTodoFromInput={addNewTodoFromInput}
          todos={todos}
          setTodos={setTodos}
          setIsLoading={setIsLoading}
          setLoadingTodoIds={setLoadingTodoIds}
          isInputDisabled={isInputDisabled}
        />

        <MainSection
          filteredTodos={filteredTodos}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
          setLoadingTodoIds={setLoadingTodoIds}
          loadingTodoIds={loadingTodoIds}
          setIsError={setIsError}
          hideErrorMessage={hideErrorMessage}
        />

        {todos.length !== 0 && (
          <Footer
            setFilter={setFilter}
            todos={todos}
            filter={filter}
            setTodos={setTodos}
            setIsError={setIsError}
            hideErrorMessage={hideErrorMessage}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!isError ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setIsError(null);
            setDate(new Date());
          }}
        />
        {isError}
      </div>
    </div>
  );
};
