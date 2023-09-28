import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoStatus } from './types/TodoStatus';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { client } from './utils/fetchClient';

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
  const [tempTodo, setTempTodo] = useState<Todo | null>({
    title: '',
    completed: false,
    id: 0,
    userId: 11577,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    if (!tempTodo || !tempTodo.title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: tempTodo.title,
      completed: false,
      userId: 11577,
    };

    client
      .post<Todo>('/todos', newTempTodo)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setTempTodo(null);
        focusInputField();
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        focusInputField();
        setIsLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);

    setTodos(updatedTodos);
    client
      .delete(`/todos/${todoId}`)
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
              data-cy="ToggleAllButton"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={tempTodo?.title || ''}
              onChange={(e) => setTempTodo((prevTempTodo) => ({
                ...(prevTempTodo || {
                  title: '',
                  completed: false,
                  id: 0,
                  userId: 0,
                }),
                title: e.target.value,
              }))}
              ref={(input) => input && input.focus()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={handleDeleteTodo}
          onToggleCompleted={handleToggleCompleted}
          isLoading={isLoading}
          todoStatus={todoStatus}
        />
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <TodoFilter
              handleFilterStatus={handleFilterStatus}
              todosFilterStatus={todoStatus}
            />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={completedTodos.length === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
