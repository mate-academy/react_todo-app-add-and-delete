/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/Filter';
import * as todosServices from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 11587;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(StatusFilter.ALL);
  const [title, setTitle] = useState('');
  const [statusResponce, setStatusResponce] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function changeErrorMessage(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    setLoading(true);

    todosServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        changeErrorMessage('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtredTodos: Todo[] = useMemo(() => {
    let filtered = todos;

    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        filtered = filtered.filter(todo => !todo.completed);
        break;

      case StatusFilter.COMPLETED:
        filtered = filtered.filter(todo => todo.completed);
        break;

      default:
        break;
    }

    return filtered;
  }, [todos, statusFilter]);

  function addTodo() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      changeErrorMessage('Title should not be empty');

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponce(true);

    todosServices.createTodo(data)
      .then(newTodo => {
        setTitle('');
        setTodos(currentTodos => [
          ...currentTodos,
          newTodo,
        ]);
      })
      .catch(() => {
        changeErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponce(false);
      });
  }

  const deleteTodo = (todoId: number) => {
    setLoading(true);

    todosServices.removeTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => changeErrorMessage('Unable to delete a todo'))
      .finally(() => setLoading(false));
  };

  const countActiveTodos = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!todos.length && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm
            title={title}
            setTitle={setTitle}
            addTodo={() => addTodo()}
            statusResponce={statusResponce}
          />

        </header>

        {!loading && (
          <>
            <TodoList
              todos={filtredTodos}
              deleteTodo={deleteTodo}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                deleteId={deleteTodo}
              />
            )}

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${countActiveTodos} items left`}
                </span>

                {/* Active filter should have a 'selected' class */}

                <TodoFilter
                  filter={statusFilter}
                  setFilter={setStatusFilter}
                />

                {/* don't show this button if there are no completed todos */}
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
