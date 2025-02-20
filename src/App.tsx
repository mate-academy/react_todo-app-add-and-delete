/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';

import * as todoService from './api/todos';

import './App.scss';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [inputValue, setInputValue] = useState('');

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement> | null>(null);

  useEffect(() => {
    setLoadingTodoIds(current => [...current, 0]);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() =>
        setLoadingTodoIds(current => current.filter(id => id !== 0)),
      );
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(current => [
      ...current,
      ...completedTodos.map(todo => todo.id),
    ]);

    try {
      await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
    } catch (error) {
      setErrorMessage('Unable to delete completed todos');
    } finally {
      setLoadingTodoIds(current =>
        current.filter(id => !completedTodos.some(todo => todo.id === id)),
      );
    }
  };

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    const temp: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const newTodo = await todoService.addTodo({
        title: inputValue.trim(),
        userId: todoService.USER_ID,
        completed: false,
      });
      setTodos(currentTodos => [...currentTodos, newTodo]);
      setInputValue('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          onChangeInputValue={setInputValue}
          setErrorMessage={setErrorMessage}
          onAddTodo={handleAddTodo}
          onRef={setInputRef}
        />

        <TodoList
          todos={todos}
          loadingTodoIds={loadingTodoIds}
          filterType={filterType}
          selectedTodoId={selectedTodo?.id || null}
          onSelectTodo={handleSelectTodo}
          onDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterType={filterType}
            onFilterType={setFilterType}
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
