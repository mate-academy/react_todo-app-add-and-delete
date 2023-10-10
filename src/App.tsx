/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { getTodos, deleteTodo, createTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
// import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { UserWarning } from './UserWarning';
import { TodoError } from './components/TodoError/TodoError';
import { TodoLoadingItem } from './components/TodoLoadingItem/TodoLoadingItem';

const USER_ID = 11534;

const filterTodos = (todos: Todo[], filterStatus: Status): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [value, setValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.Load));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(Error.None);
      }, 3000);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = filterTodos(todos, status);
  const handleFilterStatus = (todosStatus: Status) => (
    setStatus(todosStatus));

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  function addTodo({ userId, title, completed }: Todo): Promise<void> {
    setErrorMessage(Error.None);

    return createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      });
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    const todoTitle = value.trim();

    const newTodo: Todo = {
      id: todos.length + 1,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    if (!todoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setIsSubmitted(false);
    } else {
      addTodo(newTodo)
        .then(() => setValue(''))
        .finally(() => {
          setTempTodo(null);
          setIsSubmitted(false);
        });
    }
  };

  const onDelete = (todoId: number) => {
    setProcessingIds((prevTodoId) => [...prevTodoId, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setProcessingIds(
        (ids) => ids.filter(id => id !== todoId),
      ));
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDelete(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {activeTodosCount > 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={classNames('todoapp__toggle-all', {
                active: completedTodosCount,
              })}
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={isSubmitted}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          onDelete={onDelete}
          processingIds={processingIds}
        />

        {tempTodo && (
          <TodoLoadingItem
            tempTodo={tempTodo}
            isSubmitted={isSubmitted}
          />
        )}
        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} items left`}
            </span>
            <TodoFilter
              handleFilterStatus={handleFilterStatus}
              todosFilterStatus={status}
            />
            {/* Active filter should have a 'selected' class */}
            {/* don't show this button if there are no completed todos */}
            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={completedTodosCount === 0}
              onClick={onDeleteCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}

        {/* Hide the footer if there are no todos */}
      </div>

      <TodoError
        errorMessage={errorMessage}
        onErrorChange={() => {
          setErrorMessage(Error.None);
        }}
      />
    </div>
  );
};
