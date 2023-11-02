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
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 11732;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeTodo, setTypeTodo] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isAddingTodo, setIsAddingTodo] = useState(false);

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
    setIsLoading(true);

    const temporaryTodo: Todo = {
      id: 0,
      title,
      userId,
      completed,
    };

    setTempTodo(temporaryTodo);

    return todoServise.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setIsLoading(false);
        setTempTodo(null);
      })
      .catch(() => {
        setIsLoading(false);
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return todoServise.deleteTodo(todoId)
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
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

        {tempTodo && isLoading && (
          // Render the temporary todo with a loader
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            // onDelete={deleteTodo}
            isLoading={isLoading} // Use a loading flag to display a loader
          />
        )}

        {filterTodos && (
          <TodoList
            todos={filterTodos()}
            // selectedTodoId={selectedTodo?.id}
            // onSelect={setSelectedTodo}
            onDelete={deleteTodo}
          />
        )}

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
