/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, USER_ID, deleteTodo, crateTodo } from './api/todos';
import { Todo } from './types/Todo';
import TodoHeader from './Components/TodoHeader';
import TodoFooter from './Components/TodoFooter';
import TodoList from './Components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newTitle, setNewTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case 'all':
        return true;
      case 'completed':
        return todo.completed;
      case 'active':
        return !todo.completed;
      default:
        return true;
    }
  });

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const tempId = Math.random();
    const trimmedTitle = newTitle.trim();

    setLoadingTodoId(tempId);
    setIsInputDisabled(true);
    setErrorMessage(null);

    const newTodo: Todo = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodos([...todos, newTodo]);

    try {
      const addedTodo = await crateTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === tempId ? addedTodo : todo)),
      );
      setNewTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== tempId));
    } finally {
      setLoadingTodoId(null);
      setIsInputDisabled(false);
    }
  };

  const removeTodo = async (id: number) => {
    setLoadingTodoId(id);

    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deleteTodos = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(`Failed to delete todo: ${todo.title}`);
        }),
    );

    try {
      await Promise.allSettled(deleteTodos);
    } catch {
      setErrorMessage('Error occurred while clearing completed todos.');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          addTodo={addTodo}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={filteredTodos}
          loadingTodoId={loadingTodoId}
          deleteTodo={removeTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage(null)}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
