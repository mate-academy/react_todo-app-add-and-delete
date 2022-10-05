import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const filterTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Errors.Loading));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.Title);
      setTitle('');

      return;
    }

    await createTodo(userId, title)
      .then(newTodo => {
        setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setError(Errors.Add);
      });

    setTitle('');
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(Errors.Delete);
      });
  };

  const todosCompleted = todos.filter(todo => todo.completed);
  const todosActive = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              aria-label="active"
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: filterTodos.length === todosCompleted.length,
                },
              )}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={filterTodos}
          removeTodo={removeTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            removeTodo={removeTodo}
            todosActive={todosActive}
            todosCompleted={todosCompleted}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
