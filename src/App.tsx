import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import classNames from 'classnames';
import { FilterState } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>(FilterState.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setError(null);

      try {
        const todosFromApi = await getTodos();

        setTodos(todosFromApi);
      } catch (apiError) {
        setError('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterState.Active) {
      return !todo.completed;
    }

    if (filter === FilterState.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    const trimmedTitle = newTodoTitle.trim();

    setIsSubmitting(true);

    const newTempTodo: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTodos(prevTodos => [...prevTodos, newTempTodo]);
    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === newTempTodo.id ? createdTodo : todo,
        ),
      );
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
      setTodos(prevTodos =>
        prevTodos.filter(todo => todo.id !== newTempTodo.id),
      );
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  const activeCount = todos.filter(
    todo => !todo.completed && todo !== tempTodo,
  ).length;

  const handleDelete = async (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    setTempTodo(todoToDelete);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      await handleDelete(todo.id);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          todos={todos}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loading={loading}
          handleDelete={handleDelete}
          setError={setError}
        />
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
            todos={todos}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
