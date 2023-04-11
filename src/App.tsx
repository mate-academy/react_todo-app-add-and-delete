/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './Api/todos';
import { TodosList } from './components/TodoList';
import { FilterTodosBy } from './types/FilterTodosBy/FilterTodoBy';

const USER_ID = 6998;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState('');
  const [filterBy, setFilterBy] = useState(FilterTodosBy.All);
  const [query, setQuery] = useState('');

  const todosFromServer = async (userId: number) => {
    try {
      const result = await getTodos(userId);

      setTodos(result);
    } catch {
      setHasError('Error to get user from server');
    }
  };

  const visibleTodos = todos.filter((todo) => {
    let isStatusCorrect = true;

    switch (filterBy) {
      case FilterTodosBy.Active:
        isStatusCorrect = !todo.completed;
        break;

      case FilterTodosBy.Completed:
        isStatusCorrect = todo.completed;
        break;

      default:
        break;
    }

    return isStatusCorrect;
  });

  useEffect(() => {
    todosFromServer(USER_ID);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredByOptions = Object.entries(FilterTodosBy);

  const removeTodo = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setHasError('Unable to delete a todo');
      });
  };

  const addTodo = (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    return postTodo(newTodo)
      .then(result => setTodos(state => [...state, result]))
      .catch(() => setHasError('Unable to add a todo'));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setHasError('Title can\'t be empty');

      return;
    }

    addTodo(query);
    setQuery('');
  };

  return (
    <div className="todoapp">
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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        </header>

        <TodosList
          todos={visibleTodos}
          removeTodo={removeTodo}
        />

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${todos.length} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">

            {filteredByOptions.map(([label, value]) => (
              <a
                href={`#/${value}`}
                className="filter__link selected"
                key={value}
                onClick={() => setFilterBy(value)}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* don't show this button if there are no completed todos */}
          <button type="button" className="todoapp__clear-completed">
            Clear completed
          </button>
        </footer>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setHasError('')}
          />

          {/* show only one message at a time */}
          {hasError}
        </div>
      )}
    </div>
  );
};
