import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodosList } from './components/TodosList';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Navigation } from './components/Navigation';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState('All');
  const [textField, setTextField] = useState<string>('');
  const [isEmptyInput, setIsEmptyInput] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(true);

  const handleDelete = (todoId: number) => {
    setTodos((prev: Todo[]) => prev.filter((todo) => todo.id !== todoId));
  };

  const submitAction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !user) {
      return;
    }

    event.preventDefault();

    if (!textField) {
      setIsEmptyInput(true);
      setTimeout(() => setIsEmptyInput(false), 3000);

      return;
    }

    addTodo(user.id, {
      title: textField,
      userId: user.id,
      completed: false,
    }).then((loadedTodos) => {
      setTodos((prev: any) => [...prev, loadedTodos]);
    })
      .catch(() => {
        setError(true);
      });

    setTextField('');
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then((loadedTodos) => {
        setTodos(loadedTodos);
        setIsAdding(false);
      })
      .catch(() => {
        setError(true);
      });
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  function filterStatus(value: string) {
    switch (value) {
      case 'All':
        return todos;

      case 'Active':
        return todos.filter((todo: Todo) => !todo.completed);

      case 'Completed':
        return todos.filter((todo: Todo) => todo.completed);

      default:
        throw Error('Specify your status');
    }
  }

  const updatedTodos = filterStatus(status);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);

  const removeCompletedTodos = () => {
    completedTodos.forEach(async (todo: Todo) => {
      await removeTodo(todo.id);
    });

    setTodos((prev: Todo[]) => prev.filter(todo => !todo.completed));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="Mark all as complete"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              disabled={isAdding}
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={textField}
              onChange={(event) => setTextField(event.target.value)}
              onKeyDown={submitAction}
            />
          </form>
        </header>

        {todos.length > 0 ? (
          <TodosList
            setOfItems={updatedTodos}
            deleteItem={handleDelete}
          />
        ) : null}

        {todos.length ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {todos.length}
              {' '}
              items left
            </span>

            <Navigation
              changeStatus={setStatus}
              status={status}
            />
            {completedTodos.length > 0 ? (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            ) : null}

          </footer>
        ) : null}
      </div>

      {error ? (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      ) : null}

      {isEmptyInput ? (
        <div>
          Title cannot be empty
        </div>
      ) : null }
    </div>
  );
};
