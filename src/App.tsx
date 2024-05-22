/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { FilterBy } from './utils/FilterBy';
import { ErrorMessage } from './components/Error';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToLoad);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const applyFilter = (filt: string, todosArr: Todo[]) => {
    setFilteredTodos(FilterBy(filt, todosArr));
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
    applyFilter(newFilter, todos);
  };

  const handleToggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
    applyFilter(filter, updatedTodos);
  };

  function onDeleteTodo(todoId: number): Promise<void> {
    setIsSubmitting(true);

    return deleteTodo(todoId)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== todoId);

        setTodos(updatedTodos);
        setFilteredTodos(updatedTodos);
        setLoadingIds([]);
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToDelete);
        throw error;
      })
      .finally(() => setIsSubmitting(false));
  }

  const handleAddTodo = ({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>): Promise<void> => {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!title) {
      setErrorMessage(ErrorTypes.invalidTitle);
      setIsSubmitting(false);

      return Promise.resolve();
    }

    setTempTodo({ id: 0, completed: false, title: title, userId: USER_ID });

    return addTodo({ title, userId, completed })
      .then(newTodo => {
        const updatedTodos = [...todos, newTodo];

        setTodos(updatedTodos);
        setTempTodo(null);
        applyFilter(filter, updatedTodos);
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToAdd);
        setTempTodo(null);
        throw error;
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
        />

        <TodoList
          todos={filteredTodos}
          handleToggleTodo={handleToggleTodo}
          onDeleteTodo={onDeleteTodo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            filter={filter}
            handleFilterChange={handleFilterChange}
            todos={todos}
            setLoadingIds={setLoadingIds}
            onDeleteTodo={onDeleteTodo}
          />
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
