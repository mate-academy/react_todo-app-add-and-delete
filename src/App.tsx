/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, createTodo, deleteTodo } from './api/todos';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorNotification } from './Error-not';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

interface TodoInput {
  title: string;
  userId: number;
  completed: boolean;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadAllTodos = () => {
    setIsTodosLoading(true);
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => {
          setError(null);
        }, 3000);
      })
      .finally(() => setIsTodosLoading(false));
  };

  useEffect(() => {
    loadAllTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      case Filter.All:
      default:
        return true;
    }
  });

  const handleAddTodo = async (title: string): Promise<void> => {
    if (!title.trim()) {
      const errorMessage = 'Title cannot be empty';

      setError(errorMessage);

      return Promise.reject(new Error(errorMessage));
    }

    const newTodo: TodoInput = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    try {
      setIsTodosLoading(true);
      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setNewTodoTitle('');
      inputRef.current?.focus();

      setTempTodo(null);
    } catch (e) {
      setError('Unable to add a todo');
      setTimeout(() => setError(null), 3000);
      setTempTodo(null);
    } finally {
      setIsTodosLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodo(id);

    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setLoadingTodo(null);
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    idsToDelete.forEach(id => setLoadingTodo(id));

    const results = await Promise.allSettled(
      idsToDelete.map(id => deleteTodo(id)),
    );

    const failedIds: number[] = [];

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedIds.push(idsToDelete[index]);
      }
    });

    setTodos(prevTodos =>
      prevTodos.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    }

    setLoadingTodo(null);
    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          newTodoTitle={newTodoTitle}
          setLoadingTodo={setIsTodosLoading}
          setTempTodo={setTempTodo}
          setNewTodoTitle={setNewTodoTitle}
          setTodos={setTodos}
          loadingTodo={isTodosLoading}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
        />
        <TodoList
          filteredTodos={filteredTodos}
          loadingTodo={loadingTodo}
          setError={setError}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
        />
        <Footer
          filter={filter}
          todos={todos}
          setFilter={setFilter}
          handleClearCompleted={handleClearCompleted}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
