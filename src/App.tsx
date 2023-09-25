/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { getCompletedTodos } from './utils/getCompletedTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(TodosFilter.All);
  const [errorMessage, setErrorMessage] = useState('');

  const completedTodos = getCompletedTodos(todos);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const timerId = useRef(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const handleAddTodo = (todoTitle: string) => {
    return todoService
      .addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevTodos => prevTodos.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      });
  };

  const handleFilterTodo = (value: TodosFilter) => {
    setFilter(value);
  };

  const handleErrorTodo = (value: string) => {
    setErrorMessage(value);
  };

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(todo => (
      handleDeleteTodo(todo.id)));
  };

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          onTodoError={handleErrorTodo}
          onTodoAdd={handleAddTodo}
        />
        <TodoList
          todos={filteredTodos}
          onTodoDelete={handleDeleteTodo}
          onTodoUpdate={handleUpdateTodo}
        />
        {Boolean(todos.length) && (
          <TodoFilter
            todos={todos}
            filter={filter}
            completedTodos={completedTodos}
            onFilterChange={handleFilterTodo}
            onClearCompletedTodos={handleClearCompletedTodos}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
