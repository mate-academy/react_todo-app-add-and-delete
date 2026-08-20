import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Selected } from './types/Selected';
import { Filter } from './types/Filter';
import { TempTodo } from './components/TempTodo';
import { useTodos } from './hooks/useTodos';

const filters: Filter[] = [
  {
    title: 'All',
    value: 'all',
    href: '#/',
    dataCy: 'All',
  },
  {
    title: 'Active',
    value: 'active',
    href: '#/active',
    dataCy: 'Active',
  },
  {
    title: 'Completed',
    value: 'completed',
    href: '#/completed',
    dataCy: 'Completed',
  },
];

export const App: React.FC = () => {
  const {
    todos,
    error,
    setError,
    allCompleted,
    completedAllTodos,
    todosCounter,
    hasCompletedTodos,
    blockedInput,
    tempTodo,
    deletingTodoId,
    handleAddTodo,
    checkedTodoCompleted,
    removeTodo,
    clearCompleted,
  } = useTodos();

  const [selectedFilterLink, setSelectedFilterLink] = useState<Selected>('all');

  const filteredTodos = todos.filter(todo => {
    switch (selectedFilterLink) {
      case 'all':
        return true;

      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return false;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          completedAllTodos={completedAllTodos}
          allCompleted={allCompleted}
          blockedInput={blockedInput}
          setError={setError}
          handleAddTodo={handleAddTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              checkedTodoCompleted={checkedTodoCompleted}
              removeTodo={removeTodo}
              deletingTodoId={deletingTodoId}
            />

            <Footer
              selectedFilterLink={selectedFilterLink}
              setSelectedFilterLink={setSelectedFilterLink}
              todosCounter={todosCounter}
              hasCompletedTodos={hasCompletedTodos}
              clearCompleted={clearCompleted}
              filters={filters}
            />
          </>
        )}

        {tempTodo !== null && <TempTodo todo={tempTodo} />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error === '' ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        <p>{error}</p>
      </div>
    </div>
  );
};
