/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/TodoFooter';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoErrors } from './components/TodoErrors';
import { Status } from './types/Status';
import { Error } from './types/Error';

const USER_ID = 11226;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<Error>(Error.none);
  const [loading, setLoading] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);

  const addTodo = ({ title, completed, userId }: Todo) => {
    return todoService.createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError(Error.add);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setError(Error.emptyTitle);

      return;
    }

    const tempTodoData: Todo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setLoading(true);
    setTempTodo(tempTodoData);

    addTodo(tempTodoData)
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });

    setTodoTitle('');
  };

  const deleteTodo = (id: number) => {
    setLoading(true);
    setDeletingTodoIds(prevIds => [...prevIds, id]);

    return todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(Error.delete);
      })
      .finally(() => {
        setLoading(false);
        setDeletingTodoIds(prevIds => prevIds.filter(todoId => todoId !== id));
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (status) {
        case Status.completed:
          return todo.completed;

        case Status.active:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, status]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(Error.load);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.some(todo => !todo.completed);

  const handleToggleAll = () => {
    const completedTodos = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => (
      { ...todo, completed: !completedTodos }
    ));

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAll}
              className={classNames('todoapp__toggle-all', {
                active: !activeTodos,
              })}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onDelete={deleteTodo}
            deletingTodoIds={deletingTodoIds}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setTodos={setTodos}
            status={status}
            setStatus={setStatus}
            setError={setError}
            setDeletingTodoIds={setDeletingTodoIds}
          />
        )}
      </div>

      {error && (
        <TodoErrors
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
