/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState, useRef } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { createTodos, getTodos, updateTodos, deleteTodos } from './api/todos';
import { Footer } from './components/footer';
import { Filter } from './types/Filter';
import { Error } from './components/error';
import { Header } from './components/header';
import { TodoList } from './components/todoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [counterOfActiveTodos, setCounterOfActiveTodos] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);

        setCounterOfActiveTodos(
          fetchedTodos.filter(todo => !todo.completed).length,
        );
      })
      .catch(err => {
        setError('Unable to load todos' + err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  function addTodo(title: string) {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setError('Title should not be empty');

      return;
    }

    const tempTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
      id: Date.now(),
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]);

    setIsLoading(true);
    setLoadingTodoId(tempTodo.id);

    createTodos({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === tempTodo.id
              ? { ...newTodo, title: trimmedTitle }
              : todo,
          ),
        );
        setCounterOfActiveTodos(currentCount => currentCount + 1);
        setNewTodoTitle('');
        setError(null);
      })
      .catch(err => {
        setError('Unable to add a todo' + err.message);

        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== tempTodo.id),
        );
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoId(null);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  }

  function deleteTodo(todoId: number) {
    setLoadingTodoId(todoId);
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setCounterOfActiveTodos(currentCount => currentCount - 1);
      })
      .catch(err => setError('Unable to delete a todo' + err.message))
      .finally(() => setLoadingTodoId(null));
  }

  function handleDeleteAllCompleted() {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.map(todo => deleteTodo(todo.id));
  }

  function updateTodoStatus(todoId: number, completed: boolean) {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setLoadingTodoId(todoId);
    updateTodos({ ...todoToUpdate, completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(err => setError('Unable to delete a todo' + err.message))
      .finally(() => setLoadingTodoId(null));
  }

  const handleFilterChange = (newFilter: Filter) => setFilter(newFilter);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isLoading={isLoading}
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          addTodo={addTodo}
        />
        <TodoList
          filteredTodos={filteredTodos}
          updateTodoStatus={updateTodoStatus}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
        />
        {todos.length > 0 && (
          <Footer
            counterOfActiveTodos={counterOfActiveTodos}
            filter={filter}
            todos={todos}
            handleFilterChange={handleFilterChange}
            handleDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>
      <Error error={error} />
    </div>
  );
};
