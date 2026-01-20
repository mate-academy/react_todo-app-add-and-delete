import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FILTERS, FilterType } from './types/filters';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterType>(FILTERS.all);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingTodoIds(prev => [
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
          })
          .finally(() => {
            setDeletingTodoIds(prevIds => prevIds.filter(id => id !== todo.id));
          }),
      ),
    ).then(() => {
      inputRef.current?.focus();
    });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanedInput = inputValue.trim();

    if (!cleanedInput) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: cleanedInput,
      completed: false,
    });

    createTodo({ title: cleanedInput, completed: false })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === FILTERS.active) {
      return !todo.completed;
    }

    if (filterStatus === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          inputValue={inputValue}
          isAdding={isAdding}
          onInputChange={setInputValue}
          onSubmit={handleFormSubmit}
          inputRef={inputRef}
          hasTodos={todos.length > 0}
          areAllCompleted={
            todos.length > 0 && todos.every(todo => todo.completed)
          }
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          onDeleteTodo={handleDeleteTodo}
        />

        <TodoFooter
          activeCount={todos.filter(todo => !todo.completed).length}
          hasCompleted={todos.some(todo => todo.completed)}
          currentFilter={filterStatus}
          onFilterChange={setFilterStatus}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={() => setErrorMessage('')}
      />
    </div>
  );
};
