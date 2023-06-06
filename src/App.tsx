/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { addTodo, deleteTodo, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { ErrorType } from './types/ErrorTypes';

const USER_ID = 10587;

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleCloseErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleLoadTodos = useCallback(async () => {
    try {
      const todosFromApi = await getTodos(USER_ID);

      setTodos(todosFromApi);
    } catch {
      setErrorMessage(ErrorType.Load);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    handleLoadTodos();
  }, []);

  const completedTodos = useMemo(() => todos.filter(todo => todo.completed), [todos]);
  const activeTodos = useMemo(() => todos.filter(todo => !todo.completed), [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (filter) {
        case FilterType.Completed:
          return todo.completed;
        case FilterType.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  const handleNewTodoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  }, []);

  const addNewTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    setInputDisabled(true);

    if (newTodo.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    try {
      const userTodo = {
        id: 0,
        userId: USER_ID,
        title: newTodo,
        completed: false,
      };

      setIsUpdating(prev => [...prev, userTodo.id]);
      setTempTodo(userTodo);
      const res = await addTodo(userTodo);

      setTodos((prev) => [...prev, res]);
    } catch (err) {
      setErrorMessage(ErrorType.Add);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);
      setNewTodo('');
      setInputDisabled(false);
    }
  };

  const onDeleteTodo = async (id: number) => {
    // setSelectedTodoId(id);
    setInputDisabled(true);
    setIsUpdating(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setInputDisabled(false);
      setIsUpdating([]);
    }
  };

  const completedTodosId = useMemo(() => completedTodos.map(todo => todo.id), [todos]);

  const onDeleteCompleted = async () => {
    setInputDisabled(true);

    try {
      await Promise.all(
        completedTodosId.map((id) => onDeleteTodo(id)),
      );
    } catch {
      setErrorMessage(ErrorType.Delete);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={activeTodos.length > 0}
          newTodo={newTodo}
          setNewTodo={handleNewTodoChange}
          inputDisabled={inputDisabled}
          onNewTodoSubmit={addNewTodo}
        />

        <TodoList
          visibleTodos={filteredTodos}
          onDeleteTodo={onDeleteTodo}
          isUpdating={isUpdating}
          tempTodo={tempTodo}
        />

        {(filteredTodos.length
        || (filteredTodos.length === 0 && filter === FilterType.Completed)) && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todosLength={todos.length}
            hasCompletedTodos={completedTodos.length > 0}
            onDeleteCompleted={onDeleteCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          closeErrorMessage={handleCloseErrorMessage}
        />
      )}
    </div>
  );
};
