/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

function getFilteredTodos(
  currentTodos: Todo[],
  setCurrentFilter: 'all' | 'active' | 'completed',
): Todo[] {
  const filteredTodos = [...currentTodos];

  switch (setCurrentFilter) {
    case 'active':
      return filteredTodos.filter(todo => !todo.completed);
    case 'completed':
      return filteredTodos.filter(todo => todo.completed);
    case 'all':
      return filteredTodos;
    default:
      return [];
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!todoService.USER_ID) {
      return;
    }

    setIsLoading(true);
    setError('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);
    setUpdatingTodoIds(ids => [...ids, 0]);

    todoService
      .addTodo({
        userId: todoService.USER_ID,
        title: title.trim(),
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setUpdatingTodoIds(ids => ids.filter(id => id !== 0));
      });
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsLoading(true);
    setUpdatingTodoIds(prevId => [...prevId, todoId]);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setUpdatingTodoIds(prevId => prevId.filter(id => id !== todoId));
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(async todo => {
        setUpdatingTodoIds(prev => [...prev, todo.id]);

        try {
          await todoService.deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          setError('Unable to delete a todo');
        } finally {
          setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
        }
      }),
    );

    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setIsLoading(true);
    setUpdatingTodoIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await todoService.updateTodo(
        todo.id,
        !todo.completed,
      );

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setUpdatingTodoIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilteredTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          todos={todos}
          isLoading={isLoading}
          disabled={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
        />
        <TodoList
          todos={visibleTodos}
          toggleTodo={handleToggleTodo}
          isLoading={isLoading}
          updatingTodoIds={updatingTodoIds}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setCurrentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}

        {/* Hide the footer if there are no todos */}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={error} onClose={() => setError('')} />
    </div>
  );
};
