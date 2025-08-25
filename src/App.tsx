/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Todos } from './components/Todos';
import { SelectedFilter } from './types/SelectedFilter';
import { getTodos } from './api/todos';
import { ErrorMessages } from './types/ErrorMessages';
import classNames from 'classnames';

function prepareTodos(todos: Todo[], filterQuery: SelectedFilter) {
  let visibleTodos = [...todos];

  switch (filterQuery) {
    case 'active':
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;
    case 'completed':
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;
    case 'all':
      break;
  }

  return visibleTodos;
}

const ERROR_MESSAGE_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterQuery, setFilterQuery] = useState<SelectedFilter>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );

  const handleSelect = (newFilterQuery: SelectedFilter) => {
    setFilterQuery(newFilterQuery);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.ErrorTodoLoad);
        setTimeout(() => {
          setErrorMessage(ErrorMessages.None);
        }, ERROR_MESSAGE_TIMEOUT);
      });
  }, []);

  const visibleTodos = prepareTodos(todos, filterQuery);

  const remainingTodos = todos.reduce((acc, todo) => acc + +!todo.completed, 0);

  const areNoneCompleted = todos.every(todo => !todo.completed);
  const areAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header areAllCompleted={areAllCompleted} loading={false} />

        <Todos todos={visibleTodos} loadingTodoIds={[]} />

        {todos.length > 0 && (
          <Footer
            selected={filterQuery}
            itemCount={remainingTodos}
            areNoneCompleted={areNoneCompleted}
            onSelect={handleSelect}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === ErrorMessages.None,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage !== ErrorMessages.None && errorMessage}
      </div>
    </div>
  );
};
