import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { client } from './utils/fetchClient';
import { TodoFilter } from './components/TodoFilter/TodoFilter';

const USER_ID = 11577;

const filterTodos = (todos: Todo[], filterStatus: TodoStatus): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case TodoStatus.Completed:
        return todo.completed;
      case TodoStatus.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const focusInputField = () => {
    const inputField
    = document.querySelector('.todoapp__new-todo') as HTMLInputElement;

    if (inputField) {
      inputField.focus();
      inputField.value = '';
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => setTodos(data as Todo[]))
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const visibleTodos = filterTodos(todos, todoStatus);

  const handleFilterStatus = (filterHandle: TodoStatus) => {
    setTodoStatus(filterHandle);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: 11577,
    };

    setTempTodo(newTempTodo);

    setIsLoading(true);
    addTodo(newTempTodo)
      .then((newTodo) => {
        setTitle('');
        setTodos((oldTodos) => [...oldTodos, newTodo]);
        focusInputField();
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);

    setTodos(updatedTodos);
    client.delete(`/todos/${todoId}`)
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTodos(todos);
      });
  };

  const handleToggleCompleted = (todoId: number, completed: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleClearCompleted = () => {
    const completedTodoIds = completedTodos.map((todo) => todo.id);
    const updatedTodos
    = todos.filter((todo) => !completedTodoIds.includes(todo.id));

    setTodos(updatedTodos);
    Promise.all(completedTodoIds.map((todoId) => client.delete(`/todos/${todoId}`)))
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
        setTodos(todos);
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every((todo) => todo.completed);

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: todos.length })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              disabled={isLoading}
              ref={(input) => input && input.focus()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map((todo) => (
              <div
                data-cy="Todo"
                className={classNames('todo', { completed: todo.completed })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleToggleCompleted(todo.id,
                      !todo.completed)}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal', 'overlay',
                    { 'is-active': todo.id === 0 })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
            {tempTodo && (
              <div
                data-cy="Todo"
                className={classNames('todo',
                  { completed: tempTodo.completed })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={tempTodo.completed}
                    onChange={() => handleToggleCompleted(tempTodo.id,
                      !tempTodo.completed)}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(tempTodo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal', 'overlay',
                    { 'is-active': isLoading })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <TodoFilter
              handleFilterStatus={handleFilterStatus}
              todoStatus={todoStatus}
            />
            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
        <br />
      </div>
    </div>
  );
};
