/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getPreparedTodos } from './utils/todoFilter';
import * as todoService from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import { TodoForm } from './componentst/TodoForm';
import { TodoList } from './componentst/TodoList';
import { Footer } from './componentst/Footer';
import { Notification } from './componentst/Notification';
import { TodoItem } from './componentst/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const preparedTodos = getPreparedTodos(todos, filterBy);
  const completedTodos = todos.filter(todo => todo.completed);
  const todoCount = todos.length - completedTodos.length;

  const loadTodos = () => {
    setErrorMessage('');
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(loadTodos, []);

  if (!todoService) {
    return <UserWarning />;
  }

  const addTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: todoService.USER_ID,
    });

    try {
      const newTodo = await todoService.createTodos({
        title: todoTitle,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      inputRef?.current?.focus();
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      inputRef?.current?.focus();
    } finally {
      setLoading(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearTodo = async () => {
    completedTodos.forEach(todo => onRemoveTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={todos}
            setErrorMessage={setErrorMessage}
            onAddTodo={addTodo}
            inputRef={inputRef}
            todosLength={todos.length}
            isTitleDisabled={!!tempTodo}
          />
        </header>

        <TodoList
          preparedTodos={preparedTodos}
          errorMessage={errorMessage}
          loading={loading}
          onRemoveTodo={onRemoveTodo}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onRemoveTodo={onRemoveTodo}
            loading
            errorMessage={''}
          />
        )}

        {!errorMessage && (
          <Footer
            todos={todos}
            errorMessage={errorMessage}
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            todoCount={todoCount}
            onClearTodo={onClearTodo}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
