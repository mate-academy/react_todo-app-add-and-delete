/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import {
  TodoList,
  Footer,
  Header,
  Error,
  UserWarning,
  TodoItem,
} from './components';
import { filterTodos } from './use_cases/filterTodos';

export enum FilterState {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterState>(
    FilterState.All,
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const errorTimerId = useRef(0);

  const showError = (message: string) => {
    setErrorMessage(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setErrorMessage('');
    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  function handleAddTodo(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoServise.USER_ID,
    };

    setTempTodo(newTempTodo);

    setIsSubmitting(true);
    todoServise
      .createTodo(trimmedTitle)
      .then(apiTodo => {
        setTodos(prevTodos => [...prevTodos, apiTodo]);
        setTempTodo(null);
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setIsSubmitting(false));
    setTempTodo(null);
  }

  function handleHideError() {
    setErrorMessage('');
  }

  function handleFilterChange(
    event: React.MouseEvent,
    newFilterState: FilterState,
  ) {
    event.preventDefault();

    setSelectedFilter(newFilterState);
  }

  const filteredTodos = useMemo(
    () => filterTodos(selectedFilter, '', todos),
    [todos, selectedFilter],
  );

  if (!todoServise.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
        />

        {todos.length > 0 && <TodoList filteredTodos={filteredTodos} />}

        {tempTodo && <TodoItem todo={tempTodo} />}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            selectedFilter={selectedFilter}
            hasCompleted={hasCompleted}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} handleHideError={handleHideError} />
    </div>
  );
};
