/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { Header } from './components/Header/Header';
import { Section } from './components/Section/Section';
import { Footer } from './components/Footer/Footer';
import { TodosContext } from './components/Store/Store';

export const App: React.FC = () => {
  const { todos, errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div className={cn('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <Section />
        {todos.length > 0
          && (<Footer />)}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
          disabled={!errorMessage}
          style={errorMessage ? { cursor: 'pointer' } : { cursor: 'default' }}
        />
        {errorMessage && (
          <span>{errorMessage}</span>
        )}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
