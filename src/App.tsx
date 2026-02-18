/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterMethods } from './types/FilterMethods';
import { Header, HeaderRef } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteringMethod, setFilteringMethod] = useState<FilterMethods>('All');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const headerRef = useRef<HeaderRef>(null);

  const loadTodos = () => {
    return getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filteringMethod) {
      case 'Active':
        return todosFromServer.filter(todo => !todo.completed);
      case 'Completed':
        return todosFromServer.filter(todo => todo.completed);
      case 'All':
      default:
        return todosFromServer;
    }
  }, [todosFromServer, filteringMethod]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (currentId: number) => {
    setLoadingIds(prev => [...prev, currentId]);

    return deleteTodos(currentId)
      .then(() => {
        setTodosFromServer(prev => prev.filter(todo => todo.id !== currentId));
        headerRef.current?.focusInput();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== currentId));
      });
  };

  const deleteCompleted = () => {
    const completed = todosFromServer.filter(todo => todo.completed);

    Promise.all(completed.map(todo => deleteTodo(todo.id))).then(() => {
      headerRef.current?.focusInput();
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodosFromServer={setTodosFromServer}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          ref={headerRef}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={visibleTodos}
          onDelete={deleteTodo}
          loadingTodoIds={loadingIds}
        />

        {/* Hide the footer if there are no todos */}
        <Footer
          todos={todosFromServer}
          filteringMethod={filteringMethod}
          setFilteringMethod={setFilteringMethod}
          deleteCompleted={deleteCompleted}
        />
      </div>
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
