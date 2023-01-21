/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import { getTodos, postTodos, deleteTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/React/Filter';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoOnload, setTodoOnLoad] = useState<Todo | null>(null);
  const [todoIdsOnRemove, setTodoIdsOnRemove] = useState<number[]>([]);
  const [isCompleted] = useState(false);

  const focusInput = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  const downloadDataAPI = () => {
    if (user) {
      getTodos(user.id)
        .then(todosFromServer => {
          setTodos(todosFromServer);
          setTodoOnLoad(null);
          focusInput();
        })
        .catch(() => setError(Errors.Server));
    }
  };

  const deleteDataAPI = (id: number) => {
    deleteTodos(id)
      .then(() => downloadDataAPI())
      .catch(() => {
        setError(Errors.Delete);
        setTodoIdsOnRemove([]);
      });
  };

  const handleTodoDeleteButton = (todoId: number) => {
    deleteDataAPI(todoId);
    setTodoIdsOnRemove([...todoIdsOnRemove, todoId]);
  };

  const handleClearButton = () => {
    todos
      .filter(todo => todo.completed)
      .map(todo => deleteDataAPI(todo.id));

    todos.forEach(todo => {
      if (todo.completed) {
        setTodoIdsOnRemove([...todoIdsOnRemove, todo.id]);
      }
    });
  };

  const handleErrorCloser = () => setError('');

  const handleFormSubmit = () => {
    if (!input) {
      setError(Errors.Add);
      setTimeout(() => setError(''), 3000);

      return;
    }

    if (user) {
      const newTodo: Todo = {
        id: 0,
        userId: user.id,
        title: input,
        completed: false,
      };

      setIsAdding(true);
      setTodoOnLoad(newTodo);

      postTodos(newTodo)
        .then(() => setIsAdding(false))
        .catch(() => setError(Errors.Post))
        .finally(() => downloadDataAPI());
    }

    setInput('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
    setError('');
  };

  const handleTodosFilter = (filterType: string) => setFilter(filterType);

  useEffect(() => {
    downloadDataAPI();
    focusInput();
  }, []);

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
            newTodoField={newTodoField}
            input={input}
            isAdding={isAdding}
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
