/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { USER_ID, addTodo, getTodos } from './api/todos';
import { Filtering } from './types/Filtering';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer/Footer';
import { CustomError } from './components/error/CustomError';

export const App: React.FC = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [fitlerType, setFilterType] = useState(Filtering.ALL);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string>('');

  const hasItems = data.length > 0;
  const allTodosCompleted = data.every(elem => elem.completed);
  const itemsLeft = `${data.length - data.filter((elem: Todo) => elem.completed).length} items left`;

  useEffect(() => {
    const dataFromServer = getTodos();

    dataFromServer
      .then(ServerData => setData(ServerData))
      .catch(() => setError('Unable to load todos'));
  }, []);

  const filtering = (type: Filtering) => {
    switch (type) {
      case Filtering.ACTIVE:
        return data.filter(todo => !todo.completed);
      case Filtering.COMPLETED:
        return data.filter(todo => todo.completed);
      default:
        return data;
    }
  };

  const handleClick = (filterType: Filtering) => {
    setFilterType(filterType);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (query.trim() !== '') {
      const obj: Todo = {
        id: +new Date(),
        title: query,
        userId: USER_ID,
        completed: false,
      };

      addTodo(obj)
        .then(() => setQuery(''))
        .catch(() => {
          setError('Can`t add a todo');
        })
    } else {
      setError('Title should not be empty')
    }
  };

  const removeError = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
            />
          </form>
        </header>

        {hasItems && (
          <>
            <TodoList data={filtering(fitlerType)} />

            <Footer
              filterType={fitlerType}
              handleClick={handleClick}
              itemLeft={itemsLeft}
            />
          </>
        )}
      </div>
      <CustomError errorMassage={error} removeError={removeError} />
    </div>
  );
};
