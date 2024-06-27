/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodos, createTodos } from './api/todos';
import { Filter, Todo, NewTodos } from './types/Todo';
import TodoList from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorComponent } from './components/ErrorComponent';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  // #region functions
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = useMemo(() => {
    switch (selectedFilter) {
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [selectedFilter, todos]);

  const handleTodoClick = (id: number) => {
    const createTodo = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(createTodo);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTodo.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      setIsSubmitting(true);
      setTempTodo({ id: 0, title: newTodo, completed: false, userId: USER_ID });
    }
  };

  const addTodo = async ({ title, completed, userId }: NewTodos) => {
    createTodos({ title, completed, userId })
      .then(newT => {
        setTodos(currentTodo => [...currentTodo, newT]);
        setNewTodo('');
        setTempTodo(null);
        inputRef.current?.focus();
        setIsSubmitting(true);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        inputRef.current?.focus();
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleClearCompleted = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    setTodos(activeTodos);
  };

  const handleCleanButton = () => {
    setErrorMessage('');
  };

  const handleDelete = (id: number) => {
    deleteTodos(id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // #endregion;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          newTodo={newTodo}
          addTodo={addTodo}
          isSubmitting={isSubmitting}
        />

        <TodoList
          todos={filteredTodos}
          handleTodoClick={handleTodoClick}
          deleteTodos={handleDelete}
          isSubmitting={isSubmitting}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            setFilter={setSelectedFilter}
            currentFilter={selectedFilter}
          />
        )}
      </div>

      {!isLoading && (
        <ErrorComponent
          errorMessage={errorMessage}
          handleCleanButton={handleCleanButton}
        />
      )}
    </div>
  );
};
