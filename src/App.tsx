/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoFilter } from './TodoFilter';
import { Todolist } from './TodoList';
import { TodoErrors } from './TodoErrors';

const USER_ID = 11129;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorText, setErrorText] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processing, setProcessing] = useState(false);

  const hasError = !!errorText;

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((error: Error) => {
        setErrorText(error.message);
      });
  }, []);

  const visibletodos = useMemo(() => {
    switch (filter) {
      case FilterType.COMPLETED:
        return todos.filter((todo) => todo.completed);
      case FilterType.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodosHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorText('Title can\'t be empty');

      return;
    }

    setProcessing(true);

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    if (title.trim()) {
      addTodo({
        userId: USER_ID,
        title,
        completed: true,
      })
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => {
          setErrorText('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setProcessing(false);
        });
    }

    setTitle('');
  };

  const deleteTodoHandler = (todoId: number) => {
    setProcessing(true);
    deleteTodo(todoId).then(() => setTodos(todos
      .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorText('Unable to delete a todo');
      }).finally(() => {
        setProcessing(false);
      });
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompletedTodos = () => {
    completedTodos.forEach((item) => deleteTodo(item.id));
    setTodos(activeTodos);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {activeTodos.length > 0
          && (<button type="button" className="todoapp__toggle-all active" />)}

          {/* Add a todo on form submit */}
          <form onSubmit={(event) => {
            addTodosHandler(event);
          }}
          >
            <input
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setErrorText('');
              }}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={processing}
            />
          </form>
        </header>

        <Todolist
          processing={processing}
          deleteTodoHandler={deleteTodoHandler}
          todos={visibletodos}
        />

        {tempTodo !== null && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo?.title}</span>
            <button type="button" className="todo__remove">×</button>

            {/* 'is-active' class puts this modal on top of the todo */}
            <div className={classNames('modal overlay', {
              'is-active': tempTodo !== null,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodos.length} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <TodoFilter filter={filter} setFilter={setFilter} />

          {/* don't show this button if there are no completed todos */}
          {completedTodos.length > 0 && (
            <button
              onClick={clearCompletedTodos}
              type="button"
              className="todoapp__clear-completed"
            >
              Clear completed
            </button>
          )}
        </footer>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <TodoErrors
          hasError={hasError}
          errorText={errorText}
          setErrorText={setErrorText}
        />
      )}
    </div>
  );
};
