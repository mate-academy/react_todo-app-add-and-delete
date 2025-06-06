import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  addTodo as apiAddTodo,
  deleteTodo as apiDeleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Footer } from './Components/Footer/Footer';
import { TodoList } from './Components/TodoList/TodoList';
import { Header } from './Components/Header/Header';
import { ErrorMessage } from './Components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleCloseError = () => {
    setError(null);
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setError('Title should not be empty');
      setTimeout(() => setError(null), 3000);

      return;
    }

    const trimmedTitle = title.trim();

    setCreating(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await apiAddTodo(trimmedTitle);

      setTodos(prev => [
        ...prev,
        ...(Array.isArray(newTodo) ? newTodo : [newTodo]),
      ]);
      setTitle('');
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTimeout(() => setError(null), 3000);
      setTempTodo(null);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await apiDeleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [
      ...prev,
      ...completedTodos
        .map(t => t.id)
        .filter((id): id is number => typeof id === 'number'),
    ]);

    const promises = completedTodos.map(todo =>
      apiDeleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    type DeleteResult = { id: number; success: boolean };
    const results: DeleteResult[] = await Promise.all(promises);

    if (results.some((r: DeleteResult) => !r.success)) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    }

    const successIds = results
      .filter((r: DeleteResult) => r.success)
      .map(r => r.id);

    setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

    setLoadingTodoIds(prev =>
      prev.filter(id => !completedTodos.some(t => t.id === id)),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={setTitle}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          disabled={creating}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage error={error} onClose={handleCloseError} />
    </div>
  );
};
