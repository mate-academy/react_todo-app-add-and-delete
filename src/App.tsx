/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, postTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Loader } from './components/Loader';
import { ErrorNotification } from './components/ErrorNotifications';
import { USER_ID } from './api/todos';
import { TodoError } from './types/TodoError';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [newTodoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isAdding, setIsAdding] = useState(false);

  const [deletingId, setDeletingId] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingId(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      inputRef.current?.focus();
    } catch {
      setError(TodoError.DELETE);
    } finally {
      setDeletingId(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    try {
      await Promise.allSettled(
        completedTodos.map(todo => handleDeleteTodo(todo.id)),
      );
    } catch {
      setError(TodoError.DELETE);
    }
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError(TodoError.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: newTodoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    const temp = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(temp);
    setIsAdding(true);

    try {
      setIsAdding(true);
      const createdTodo = await postTodos(newTodo);

      setTodos(prev => [...prev, createdTodo]);
      setTodoTitle('');
      setError(null);
    } catch {
      setError(TodoError.ADD);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const activeCount = todos.filter(todo => !todo.completed).length;

  const filtredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(TodoError.LOAD))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && <Loader />}

      <div className="todoapp__content">
        <TodoHeader
          newTodoTitle={newTodoTitle}
          onTitleChange={setTodoTitle}
          onSubmit={handleAddTodo}
          isDisabled={isAdding}
          isAdding={isAdding}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filtredTodos}
            tempTodo={tempTodo}
            onDeleteTodo={handleDeleteTodo}
            deletingId={deletingId}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filter={filter}
            onFilterChange={setFilter}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            deletingId={deletingId}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
