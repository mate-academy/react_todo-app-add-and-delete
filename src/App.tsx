/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header, USER_ID } from './components/Header';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { FilteredBy } from './types/FilteredBy';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeTodo, setTypeTodo] = useState<FilteredBy>(FilteredBy.ALL);

  const filterTodos = () => {
    switch (typeTodo) {
      case FilteredBy.Active:
        return todos.filter((todo) => !todo.completed);
      case FilteredBy.Completed:
        return todos.filter((todo) => todo.completed);
      case FilteredBy.ALL:
        return todos;
      default:
        return todos;
    }
  };

  const addTodo = ({ title, completed, userId } : Todo) => {
    createTodo({ title, completed, userId })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]));
  };

  const handleTodoStatusUpdate = (completed: boolean, id: Todo['id']) => {
    updateTodo({ completed }, id, USER_ID)
      .then(() => {
        setTodos((prev) => prev.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              completed,
              id,
            };
          }

          return todo;
        }));
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromserver => (setTodos(todosFromserver)));
  }, []);

  const onDelete = (todoId: Todo['id']) => {
    deleteTodo(todoId);

    setTodos((curr) => curr.filter((todo) => todo.id !== todoId));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header handleSubmit={addTodo} />
        <TodoList
          todos={todos}
          handleTodoStatusUpdate={handleTodoStatusUpdate}
          onDelete={onDelete}
        />
        <Footer
          todos={todos}
          filterBy={typeTodo}
          onFilter={setTypeTodo}
          countTodos={filterTodos().length}
        />
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {todos.length === 0 && 'Unable to load todos'}
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
