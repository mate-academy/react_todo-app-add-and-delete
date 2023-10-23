/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { TodoFooter } from './Components/TodoFooter';
import { TodoList } from './Components/TodoList';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { createNewTodo, getTodos, removeTodo } from './api/todos';
import { ErrorNotify } from './Components/ErrorNotify';

const USER_ID = 11137;

function getFilteredTodos(
  todos: Todo[],
  status:Status,
) {
  const visibleTodos = [...todos];

  return visibleTodos.filter(todo => {
    switch (status) {
      case Status.completed:
        return todo.completed;

      case Status.active:
        return !todo.completed;

      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);
  const [loading, setLoading] = useState<boolean>(false);
  const [handleError, setHandleError] = useState<null | string>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      }).catch(() => setHandleError('Unable to upload todos'));

    setTimeout(() => {
      setHandleError(null);
    }, 3000);
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, status),
    [todos, status],
  );

  const addTodo = useCallback(async (todo: Todo) => {
    try {
      setLoading(true);
      const newTodo = await createNewTodo(todo);

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
    } catch (error) {
      setHandleError('Unable to add a todo');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoading(true);
      await removeTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setHandleError('Unable to remove todo');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompleted = useCallback(async () => {
    try {
      const completedTodoIds = filteredTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      await Promise.all(completedTodoIds.map(todoId => removeTodo(todoId)));
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (error) {
      setHandleError('Unable to remove completed todo');
    } finally {
      setLoading(false);
    }
  }, [filteredTodos]);

  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    }, [],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo: Todo = {
      id: Date.now(),
      completed: false,
      title,
      userId: USER_ID,
    };

    await addTodo(newTodo);
  };

  const todosCount = filteredTodos.filter(todo => !todo.completed).length;
  const completedTodos = filteredTodos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      {loading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              title={title}
              onChange={onChangeHandler}
              disabled={loading}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
            />

            <TodoFooter
              getStatus={setStatus}
              status={status}
              activeTodos={todosCount}
              completedTodos={completedTodos}
              deleteCompleted={deleteCompleted}
            />
          </>
        )}
      </div>

      {handleError
        && <ErrorNotify error={handleError} setError={setHandleError} />}
    </div>
  );
};
