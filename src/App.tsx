/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { getTodos, createTodo, removeTodo } from './api/todos';
import { Todo, CreatedTodo } from './types/Todo';
import { Message } from './components/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { FilterTodos } from './types/FilterTodos';

const USER_ID = 10910;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredTodos, setFiltredTodos] = useState<string>(FilterTodos.all);
  const [visibleError, setVisibleError] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setVisibleError('Unable to load todos'));
  }, []);

  const visibleTodos = useMemo<Todo[]>(() => {
    switch (filtredTodos) {
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filtredTodos]);

  const handleSubmit = async (data: CreatedTodo) => {
    try {
      if (title.trim() === '') {
        setVisibleError("Title can't be empty");

        return;
      }

      const newTodo = await createTodo(data);

      setTodos(prevTodos => ([...prevTodos, newTodo]));
      setTitle('');
    } catch (error) {
      setVisibleError('Unable to add a todo');
      setTitle('');
    }
  };

  const handleRemove = async (todoId: number) => {
    try {
      const removedTodo = await removeTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

      return removedTodo;
    } catch (error) {
      setVisibleError('Unable to delete a todo');

      return null;
    }
  };

  const handleChangeCheckBox = (todoId: number) => {
    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return { ...todo, completed: !todo.completed };
    }));
  };

  const handleClearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const removedTodos = await (completedTodos.map(todo => (
      removeTodo(todo.id))));

    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));

    return removedTodos;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          userId={USER_ID}
          todos={todos}
          setTodos={setTodos}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleRemove={handleRemove}
          handleChangeCheckBox={handleChangeCheckBox}
        />

        {/* Hide the footer if there are no todos */}
        <TodoFooter
          visibleTodos={visibleTodos}
          filtredTodos={filtredTodos}
          setFiltredTodos={setFiltredTodos}
          handleClearCompletedTodos={handleClearCompletedTodos}
        />
      </div>

      <Message
        visibleError={visibleError}
        setVisibleError={setVisibleError}
      />
    </div>
  );
};
