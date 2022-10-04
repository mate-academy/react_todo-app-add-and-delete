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
import { Error } from './types/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setError] = useState<Error | null>(null);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (errorMessage) {
    setTimeout(() => {
      setError(null);
      setIsAdding(false);
    }, 3000);
  }

  let userId = 2;

  if (user?.id) {
    userId = user.id;
  }

  getTodos(userId)
    .then(setTodos)
    .catch(() => setError(Error.Loading));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.Title);
      setTitle('');

      return;
    }

    setIsAdding(true);

    await createTodo(userId, title)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setError(Error.Add);
      });

    setTitle('');
    setIsAdding(true);
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setError(Error.Delete);
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
        {(isAdding || todos.length > 0) && (
          <TodoList
            todos={visibleTodos}
            removeTodo={removeTodo}
            title={title}
          />
        )}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            changeFilter={setFilter}
            todos={todos}
            removeTodo={removeTodo}
          />
        )}
      </div>
      {errorMessage && (
        <ErrorMessage errorMessage={errorMessage} handleError={setError} />
      )}
    </div>
  );
};
