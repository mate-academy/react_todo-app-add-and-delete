/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Input } from './components/Input/Input';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorField } from './components/ErrorField/ErrorField';
import { getTodos, createTodo, deleteTodos } from './api/todos';

const USER_ID = 11893;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filterTodos = () => {
    let filteredList = todos;

    if (filter === 'Active') {
      filteredList = todos.filter(todo => !todo.completed);
    }

    if (filter === 'Completed') {
      filteredList = todos.filter(todo => todo.completed);
    }

    return filteredList;
  };

  const filteredTodos = filterTodos();

  const activeChecker = todos.some(todo => !todo.completed);

  const displayError = async (errorMessage: string) => {
    setError(errorMessage);

    setTimeout(() => setError(''), 3000);
  };

  const addNewTodo = (title: string): void => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(todo => {
        setTodos((prevTodos) => [...prevTodos, todo]);
        setTempTodo(null);
      })
      .catch(() => displayError('Unable to add a todo'));
  };

  const deleteTodo = (id: number) => {
    deleteTodos(id)
      .then(() => setTodos(
        (currentTodos) => currentTodos.filter(todo => todo.id !== id),
      ))
      .catch(() => displayError('Unable to delete a todo'));
  };

  const deleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(listOfTodos => setTodos(listOfTodos))
      .catch(() => displayError('Unable to load todos'));
  }, [filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Input
          activeTodo={activeChecker}
          addNewTodo={addNewTodo}
          displayError={displayError}
        />

        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          filter={filter}
          changeFilter={setFilter}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          deleteCompleted={deleteCompleted}
        />
      </div>

      <ErrorField error={error} removeError={setError} />
    </div>
  );
};
