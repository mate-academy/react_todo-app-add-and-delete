/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, FormEvent,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(false);
  const [errorMessage] = useState('');
  const [title, setTitle] = useState('');

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  let userId = 2;

  if (user?.id) {
    userId = user.id;
  }

  getTodos(userId)
    .then(setTodos)
    .catch(() => setError(false));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(error);
      setTitle('');

      return;
    }

    await createTodo(userId, title)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setError(error);
      });

    setTitle('');
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setError(error);
      });
  };

  const visibleTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.All:
        return todo;

      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return 0;
    }
  });

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>
        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
        />
        <Footer
          filter={filter}
          changeFilter={setFilter}
          todos={todos}
          removeTodo={removeTodo}
        />
      </div>
      <ErrorMessage
        error={error}
        handleError={setError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
