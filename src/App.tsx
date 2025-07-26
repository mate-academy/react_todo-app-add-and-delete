/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { addNewTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { ErrorMessage } from './components/ErrorMessage';
import { Filter } from './utils/Filter';

export const App: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      inputRef.current?.focus();
    }
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);

    const temp = {
      id: 0,
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    setTempTodo(temp);

    try {
      const createdTodo = await addNewTodo({
        userId: USER_ID,
        title: newTodo.trim(),
        completed: false,
      });

      setNewTodo('');

      setTodos(prev => [...prev, createdTodo]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (err) {
      setErrorMessage('Unable to add a todo');
      inputRef.current?.focus();
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodoId(id);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch (err) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo.id)),
    );

    const successfullyDeletedIds = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<number>).value);

    const failedDeletions = results.some(r => r.status === 'rejected');

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );
    inputRef.current?.focus();

    if (failedDeletions) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          onSubmit={handleAddTodo}
          isDisabled={isAdding}
          inputRef={inputRef}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          loadingTodoId={loadingTodoId}
        />

        {tempTodo && (
          <TodoItem onDelete={handleDeleteTodo} todo={tempTodo} isLoading />
        )}

        {/* Hide the footer if there are no todos */}
        {todos && todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
