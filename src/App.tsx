/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, removeTodo } from './api/todos';
import { Todo, CreatedTodo } from './types/Todo';
import { Message } from './components/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';

const USER_ID = 10910;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedNav, setSelectedNav] = useState('All');
  const [visibleError, setVisibleError] = useState('');
  const [title, setTitle] = useState('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setVisibleError('Unable to load a todos'));
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  let visibleTodos = useMemo<Todo[]>(() => todos, [todos]);

  switch (selectedNav) {
    case 'Active':
      visibleTodos = visibleTodos.filter(todo => todo.completed === false);
      break;

    case 'Completed':
      visibleTodos = visibleTodos.filter(todo => todo.completed === true);
      break;

    default:
      break;
  }

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
          selectedNav={selectedNav}
          setSelectedNav={setSelectedNav}
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
