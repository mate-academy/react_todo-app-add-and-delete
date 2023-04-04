/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import {
  getTodos,
  addTodos,
  changeTodo,
  deleteTodos,
} from '../../api/todos';
import { TodoList } from '../TodoList/TodoList';
import { TodoFilter } from '../TodoFilter/TodoFilter';
import { TodoItem } from '../TodoItem/TodoItem';

enum Error {
  download = 'download',
  add = 'add',
  update = 'update',
  delete = 'delete',
  empty = 'empty',
}

type Props = {
  userId: number,
};

export const TodoApp: React.FC<Props> = ({ userId }) => {
  const [todosOriginal, setTodosOriginal] = useState<Todo[] | undefined>();
  const [todos, setTodos] = useState<Todo[] | undefined>();
  const [activeTodo, setActiveTodo] = useState(0);
  const [selected, setSelected] = useState('all');
  const [query, setQuery] = useState('');
  const [errorFailed, setErrorFailed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [idTodo, setIdTodo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<Todo | null>(null);

  const notificationsHandler = (value: Error) => {
    setError(value);
    setErrorFailed(true);
    setTimeout(() => [setError(null), setErrorFailed(false)], 3000);
  };

  const fetchTodos = async () => {
    setErrorFailed(false);

    try {
      const todosArr: Todo[] = await getTodos(userId);

      const activeCount = todosArr.filter(el => !el.completed).length;

      setTodosOriginal(todosArr);
      setTodos(todosArr);
      setActiveTodo(activeCount);
    } catch {
      notificationsHandler(Error.download);
    }

    setCreating(null);
    setIdTodo(0);
  };

  const createTodo = async (value: string) => {
    setLoading(true);
    setErrorFailed(false);

    if (!query) {
      notificationsHandler(Error.empty);
      setLoading(false);
      setCreating(null);

      return;
    }

    setCreating({
      id: 0,
      userId,
      title: value,
      completed: false,
    });

    try {
      await addTodos('/todos', {
        userId,
        title: value,
        completed: false,
      });
      fetchTodos();
    } catch {
      setIdTodo(0);
      notificationsHandler(Error.add);
      setCreating(null);
    }

    setLoading(false);
    setQuery('');
  };

  const updateTodo = async (
    id: number,
    value: string,
    complete: boolean,
  ) => {
    setIdTodo(id);

    try {
      await changeTodo(`/todos/${id}`, {
        title: value,
        completed: complete,
      });
      fetchTodos();
    } catch {
      setIdTodo(0);
      notificationsHandler(Error.update);
    }
  };

  const deleteTodo = async (id: number) => {
    setIdTodo(id);
    setErrorFailed(false);

    try {
      await deleteTodos(`/todos/${id}`);
      fetchTodos();
    } catch {
      setIdTodo(0);
      notificationsHandler(Error.delete);
    }
  };

  const deleteCompletedTodo = () => {
    const idCompleted: number[] = [];

    todosOriginal?.forEach((tod: Todo) => {
      if (tod.completed) {
        idCompleted.push(tod.id);
      }
    });

    idCompleted.forEach(async (elem: number) => {
      setIdTodo(elem);

      try {
        await deleteTodos(`/todos/${elem}`);
        fetchTodos();
      } catch {
        setIdTodo(0);
        notificationsHandler(Error.delete);
      }
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchTodos();
  }, []);

  const statusTodosHandler = async (value: string) => {
    let newTodos: Todo[] | undefined = [];

    switch (value) {
      case 'active':
        newTodos = todosOriginal?.filter((ele: Todo) => !ele.completed);
        setTodos(newTodos);

        return;
      case 'completed':
        newTodos = todosOriginal?.filter((ele: Todo) => ele.completed);
        setTodos(newTodos);

        return;
      default:
        setTodos(todosOriginal);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {(todos && todos.length > 0) && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: !activeTodo },
              )}
            />
          )}

          <form
            onSubmit={() => createTodo(query)}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setErrorFailed(false);
                setError(null);
              }}
              disabled={loading}
            />
          </form>
        </header>

        {todos && (
          <TodoList
            todos={todos}
            updateTodo={updateTodo}
            idTodo={idTodo}
            deleteTodo={deleteTodo}
          />
        )}

        {creating && (
          <TodoItem
            todo={creating}
            key={creating.id}
            updateTodo={updateTodo}
            idTodo={idTodo}
            deleteTodo={deleteTodo}
          />
        )}

        {!!todosOriginal?.length && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodo} items left`}
            </span>

            <TodoFilter
              statusTodosHandler={statusTodosHandler}
              selected={selected}
              setSelected={setSelected}
            />

            {activeTodo !== todosOriginal.length && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={deleteCompletedTodo}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        className="notification is-danger is-light has-text-weight-normal"
        hidden={!errorFailed}
      >
        <button
          type="button"
          className="delete"
          onClick={() => {
            setError(null);
            setErrorFailed(false);
          }}
        />
        {error !== 'empty' ? (`Unable to ${error} a todo`) : ("Title can't be empty")}
      </div>
    </div>
  );
};
