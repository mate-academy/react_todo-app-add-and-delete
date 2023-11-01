/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import * as todoServise from './api/todos';
import { TodoFilter } from './types/TodoFilter';

const USER_ID = 11732;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeTodo, setTypeTodo] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState('');

  const filterTodos = () => {
    switch (typeTodo) {
      case TodoFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TodoFilter.Completed:
        return todos.filter(todo => todo.completed);
      case TodoFilter.All:
        return todos;
      default:
        return todos;
    }
  };

  useEffect(() => {
    todoServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const createTodo = ({ title, userId, completed }: Todo) => {
    todoServise.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      });
  };

  const deleteTodo = (todoId: number) => {
    todoServise.deleteTodo(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const clearCompletedTodos = () => todos.filter(({ completed }) => completed)
    .forEach(todo => deleteTodo(todo.id));

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          // key={selectedTodo?.id}
          todos={todos}
          onSubmit={createTodo}
          fixedUserId={USER_ID}
          error={setErrorMessage}
        />

        <TodoList
          todos={filterTodos()}
          // selectedTodoId={selectedTodo?.id}
          // onSelect={setSelectedTodo}
          onDelete={deleteTodo}
        />

        {todos.length && (
          <Footer
            todos={todos}
            filter={typeTodo}
            onFilter={setTypeTodo}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
