/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodos,
  getTodos,
  toggleTodo,
  USER_ID,
} from './api/todos';

import { FilterStatus } from './utils/FilterStatus';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [todoOnLoading, setTodoOnLoading] = useState<number[] | null>(null);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const loadTodos = () => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getTodos()
      .then(result => setTodos(result))
      .catch(err => setErrorMessage(err.message || 'Unable to load todos'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const removeTodo = (todoId: number) => {
    setTodoOnLoading([todoId]);
    deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(err => setErrorMessage(err.message || 'Unable to delete a todo'))
      .finally(() => setTodoOnLoading(null));
  };

  const handleDeleteCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodoOnLoading(completedTodosId);

    Promise.allSettled(completedTodosId.map(id => deleteTodos(id)))
      .then(results => {
        const successfulIds = completedTodosId.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        const hasErrors = results.some(result => result.status === 'rejected');

        if (hasErrors) {
          setErrorMessage('Unable to delete a todo');
        }

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .catch(err => setErrorMessage(err.message || 'Unable to delete todos'))
      .finally(() => setTodoOnLoading(null));
  };

  const handleAddTodos = async (title: string) => {
    let hasError = false;

    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return null;
    }

    const todo: Omit<Todo, 'id'> = {
      completed: false,
      title: title.trim(),
      userId: USER_ID,
    };

    setTempTodo({ ...todo, id: 0 });
    try {
      const newTodo = await addTodo(todo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error: any) {
      setErrorMessage(error.message || 'Unable to add a todo');
      hasError = true;
    } finally {
      setTempTodo(null);
    }

    return hasError;
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.All:
        return true;
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const onToggle = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    const toggledTodo = todos.find(todo => todo.id === id);

    if (!toggledTodo) {
      return;
    }

    toggleTodo(id, !toggledTodo.completed).catch(() => {
      setTodos(prevTodos => [...prevTodos]);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && <div>Loading...</div>}

      <div className="todoapp__content">
        <Header
          handleAddTodos={handleAddTodos}
          tempTodo={tempTodo}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          removeTodo={removeTodo}
          todoOnLoading={todoOnLoading}
          handleToggle={onToggle}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            todoOnLoading={[0]}
            handleToggle={onToggle}
          />
        )}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
