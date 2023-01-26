/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext, useEffect, useState,
} from 'react';

import { getTodos, postTodos, deleteTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter, Filters } from './components/React/Filter';
import { NewTodo } from './components/React/NewTodo';
import { TodoList } from './components/React/TodoList';
import { Todo } from './types/Todo';

enum Errors {
  Server = 'Unable to load data from the Server',
  Post = 'Unable to add the Todo',
  Add = 'Title can\'t be empty',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoOnload, setTodoOnLoad] = useState<Todo | null>(null);
  const [todoIdsOnRemove, setTodoIdsOnRemove] = useState<number[]>([]);
  const [isCompleted] = useState(false);

  const fetch = () => {
    if (user) {
      getTodos(user.id)
        .then(todosFromServer => setTodos(todosFromServer))
        .catch(() => setError(Errors.Server));
    }
  };

  const deleteTodo = (id: number) => {
    deleteTodos(id)
      .then(() => fetch())
      .catch(() => {
        setError(Errors.Delete);
      })
      .finally(() => {
        const remainingIds = [...todoIdsOnRemove]
          .filter(todoId => todoId !== id);

        setTodoIdsOnRemove([...remainingIds]);
      });
  };

  const handleTodoDeleteButton = (todoId: number) => {
    deleteTodo(todoId);
    setTodoIdsOnRemove([...todoIdsOnRemove, todoId]);
  };

  const handleClearButton = () => {
    const completedTodosIds = [...todos]
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodoIdsOnRemove([...todoIdsOnRemove, ...completedTodosIds]);

    completedTodosIds.forEach(id => deleteTodo(id));
  };

  const handleErrorCloser = () => setError('');

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!input) {
      setError(Errors.Add);
      setTimeout(() => setError(''), 3000);

      return;
    }

    if (user) {
      const newTodoTemplate = {
        id: 0,
        userId: user.id,
        title: input,
        completed: false,
      };

      setIsAdding(true);

      try {
        setTodoOnLoad(newTodoTemplate);

        const newTodo = await postTodos(newTodoTemplate);

        setTodos([...todos, newTodo]);
      } catch {
        setError(Errors.Post);
      } finally {
        setInput('');
        setIsAdding(false);
        setTodoOnLoad(null);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
    setError('');
  };

  const handleTodosFilter = (filterType: Filters) => setFilter(filterType);

  useEffect(() => fetch(), []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all"
          />

          <NewTodo
            input={input}
            isAdding={isAdding}
            todoOnload={todoOnload}
            onInputChange={handleInputChange}
            onSubmit={handleFormSubmit}
          />
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              todoOnLoad={todoOnload}
              todoIdsOnRemove={todoIdsOnRemove}
              onTodoDelete={handleTodoDeleteButton}
            />
            <Filter
              filter={filter}
              isCompleted={isCompleted}
              todos={todos}
              onFilterChange={handleTodosFilter}
              onCompletedClear={handleClearButton}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleErrorCloser()}
        />
        {error}
      </div>
    </div>
  );
};
