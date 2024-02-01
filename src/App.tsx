/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { USER_ID, getTodos } from './api/todos';
import { TodoComponent } from './components/TodoComponent/TodoComponent';
import { Filter } from './types/Filter';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodosProvider } from './TodosContext/TodoProvider';
import { Footer } from './components/Footer/Footer';

function prepareTodos(todos: Todo[], filter: Filter): Todo[] {
  let todosCopy = [...todos];

  if (filter === Filter.Active) {
    todosCopy = todosCopy.filter(todo => todo.completed === false);
  }

  if (filter === Filter.Completed) {
    todosCopy = todosCopy.filter(todo => todo.completed === true);
  }

  return todosCopy;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const addTodo = (todo: Todo): void => {
    setTodos((prevTodos) => ([...prevTodos, todo]));
  };

  const removeTodo = (todoId: number): void => {
    setTodos(prev => prev.filter(({ id }) => id !== todoId));
  };

  const handleTempTodo = (value: null | Todo):void => {
    setTempTodo(value);
  };

  function setErrorHide():void {
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  const preparedTodos = prepareTodos(todos, filter);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosServer) => {
        setTodos(todosServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(setErrorHide, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoForm
            setError={setErrorMessage}
            addTodo={addTodo}
            handleTempTodo={handleTempTodo}
          />
        </header>

        <TodosProvider>
          {todos && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                {preparedTodos?.map(todo => (
                  <TodoComponent
                    todo={todo}
                    key={todo.id}
                    onDelete={removeTodo}
                    onError={setErrorMessage}
                  />
                ))}
              </section>
              {!!tempTodo && (
                <TodoComponent
                  todo={tempTodo}
                  onDelete={removeTodo}
                  onError={setErrorMessage}
                />
              )}

              {todos.length > 0 && (
                <Footer
                  filter={filter}
                  todos={todos}
                  onFilter={setFilter}
                  onRemove={removeTodo}
                  onError={setErrorMessage}
                />
              )}
            </>
          )}
        </TodosProvider>
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorHide={setErrorHide}
      />
    </div>
  );
};
