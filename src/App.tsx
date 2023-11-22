/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Todolist } from './components/Todolist/Todolist';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { Errors } from './types/Error';

const USER_ID = 11843;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.all);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState(Filter.all);
  const [temptodo, setTempTodo] = useState<Todo | null>(null);
  const [loader, setloader] = useState<boolean | number>(false);

  const clickHandler = (value: Filter) => {
    switch (value) {
      case Filter.active:
        setFilterBy(Filter.active);
        setActiveFilter(Filter.active);
        break;
      case Filter.completed:
        setFilterBy(Filter.completed);
        setActiveFilter(Filter.completed);
        break;
      default:
        setFilterBy(Filter.all);
        setActiveFilter(Filter.all);
        break;
    }
  };

  useEffect(() => {
    getTodos(USER_ID).catch().then(setTodos)
      .catch(() => setError(Errors.unableLoad));
  }, []);

  if (error) {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const displayfiltered = () => {
    let filteredtodos = [...todos];

    switch (filterBy) {
      case Filter.active:
        filteredtodos = filteredtodos.filter(todo => !todo.completed);
        break;
      case Filter.completed:
        filteredtodos = filteredtodos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filteredtodos;
  };

  const displayTodos = [...displayfiltered()];

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          setTempTodo={setTempTodo}
          temptodo={temptodo}
        />

        <Todolist
          displayTodos={displayTodos}
          temptodo={temptodo}
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          setloader={setloader}
          loader={loader}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0
          && (
            <Footer
              clickHandler={clickHandler}
              activeFilter={activeFilter}
              displayTodos={todos}
              setloader={setloader}
              setTodos={setTodos}
              todos={todos}
              setError={setError}
            />
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn('notification', 'is-danger', 'is-light', 'has-text-weight-normal', { hidden: !error })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error === Errors.unableLoad && ('Unable to load todos')}
        {error === Errors.title && ('Title should not be empty')}
        {error === Errors.unableAdd && ('Unable to add a todo')}
        {error === Errors.unableDelete && ('Unable to delete a todo')}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
