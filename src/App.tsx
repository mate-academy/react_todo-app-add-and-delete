/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Body } from './components/Body';
import { Footer } from './components/Footer';
import { TodoErrors } from './components/Errors/TodoErrors';
import { Filter } from './types/FilterType';
import { useTodos } from './components/hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    setShowError,
    showError,
    add,
    remove,
    toggle,
    hideError,
    tempTodo,
    deleteId,
    removeCompleted,
  } = useTodos();

  const [filter, setFilter] = useState<Filter>('all');

  // Filter todos based on the selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return todo;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header onTodoAdded={add} isLoading={isLoading} />
        <Body
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleTodoDeleted={remove}
          isLoading={isLoading}
          handleToggleCompleted={toggle}
          deleteId={deleteId}
        />
        {todos.length > 0 && (
          <Footer
            counterValue={todos.filter(todo => !todo.completed).length}
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            isLoading={isLoading}
            removeCompleted={removeCompleted}
          />
        )}
      </div>

      <TodoErrors
        error={error}
        setError={hideError}
        setShowError={setShowError}
        showError={showError}
      />
    </div>
  );
};
