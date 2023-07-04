/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Filters } from './types/Filter';

const USER_ID = 10908;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState(Filters.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const removeError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => {
        setTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setTimeout(removeError, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = () => {
    switch (filter) {
      case Filters.ACTIVE:
        return uncompletedTodos;

      case Filters.COMPLETED:
        return completedTodos;
      default:
        return todos;
    }
  };

  const createTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const createdTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo(todoTitle);
    setTodoTitle('');
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => (
    setTodoTitle(event.target.value)
  );

  const handleClearCompleted = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all',
              { active: uncompletedTodos.length !== 0 })}
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleTodoTitle}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <TodoList todos={filteredTodos()} removeTodo={removeTodo} />

        {todos.length !== 0
        && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${uncompletedTodos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link',
                  { selected: filter === Filters.ALL })}
                onClick={() => setFilter(Filters.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link',
                  { selected: filter === Filters.ACTIVE })}
                onClick={() => setFilter(Filters.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  { selected: filter === Filters.COMPLETED })}
                onClick={() => setFilter(Filters.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodos.length}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
