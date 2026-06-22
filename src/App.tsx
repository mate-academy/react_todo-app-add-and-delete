/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Types';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputText, setInputText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = inputText.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    try {
      const newTodoFromServer = await createTodo({
        userId: USER_ID,
        title: normalizedTitle,
        completed: false,
      });

      setTodos([...todos, newTodoFromServer]);
      setInputText('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);

      if (newTodoField.current) {
        setTimeout(() => newTodoField.current?.focus(), 0);
      }
    }
  };

  const handleDelete = async (todoID: number) => {
    setProcessingIds(currentIds => [...currentIds, todoID]);

    try {
      await deleteTodo(todoID);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoID));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoID));

      if (newTodoField.current) {
        setTimeout(() => newTodoField.current?.focus(), 0);
      }
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'completed') {
      return todo.completed;
    }

    if (filter === 'active') {
      return !todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isDisabled={!!tempTodo}
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={handleSubmit}
          inputRef={newTodoField}
        />

        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
