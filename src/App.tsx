/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';

import { ErrorNotification } from './components/ErrorNotification';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoFieldRef = React.useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage('');

      try {
        const data = await todoService.getTodos();

        setTodos(data);
      } catch {
        showError(ErrorMessage.Load);
      }
    };

    loadTodos();
    todoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      todoFieldRef.current?.focus();
    }
  }, [isLoading, todos.length]);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage('');

    const trimmedTodoTitle = newTodoTitle.trim();

    if (!trimmedTodoTitle) {
      showError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTodoTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await todoService.createTodo(trimmedTodoTitle);

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setErrorMessage('');

    setLoadingIds(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onToggleTodo = async (todo: Todo) => {
    setErrorMessage('');
    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={todoFieldRef}
          title={newTodoTitle}
          onTitleChange={setNewTodoTitle}
          onSubmit={handleFormSubmit}
          isToggleAllActive={
            todos.length > 0 && todos.every(todo => todo.completed)
          }
          isLoading={isLoading}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              loadingIds={loadingIds}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              onToggleTodo={onToggleTodo}
            />
            <Footer
              activeTodosCount={activeTodosCount}
              filter={filter}
              setFilter={setFilter}
              hasCompleted={todos.some(todo => todo.completed)}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
