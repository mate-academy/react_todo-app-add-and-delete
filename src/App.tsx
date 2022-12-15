/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext, AuthProvider } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotifications } from './components/ErrorNotifications/ErrorNotifications';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [error, setError] = useState<Error>(Error.None);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    setError(Error.None);

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setError(Error.NoTodos);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  const todosFilter = () => {
    switch (status) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      case Status.All:
      default:
        return todos;
    }
  };

  const visibleTodos = todosFilter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(Error.None);

    if (title && user) {
      setIsAdding(true);
      try {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });
        await loadTodos();
        setTitle('');
      } catch {
        setError(Error.Add);
      } finally {
        setIsAdding(false);
      }
    } else {
      setError(Error.Title);
    }
  };

  const deleteCurrentTodo = async (todoId: number) => {
    await deleteTodo(todoId);

    await loadTodos();
  };

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
            <TodoForm
              title={title}
              isAdding={isAdding}
              onSubmit={handleSubmit}
              onTitleChange={setTitle}
            />
          </header>
          <TodoList todos={visibleTodos} onTodoDelete={deleteCurrentTodo} />

          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <TodoFilter
              status={status}
              onStatusChange={setStatus}
            />

          </footer>
        </div>

        <ErrorNotifications error={error} onErrorMessageChange={setError} />
      </div>
    </AuthProvider>
  );
};
