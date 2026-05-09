/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import {
  Filter,
  FILTER_ALL,
  FILTER_ACTIVE,
  FILTER_COMPLETED,
} from './types/Filter';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Footer } from './components/Footer';
import { TodoContext } from './components/TodoContext';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Section } from './components/Section';

const getFilteredTodos = (todos: Todo[], filter: Filter): Todo[] => {
  switch (filter) {
    case FILTER_ALL:
      return todos;
    case FILTER_ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FILTER_COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const { todos, filter, errorMessage, setErrorMessage } =
    useContext(TodoContext)!;
  const filteredTodos = getFilteredTodos(todos, filter);
  const [hidden, setHidden] = React.useState(true);
  const hideTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (errorMessage) {
      setHidden(false);
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      hideTimeout.current = setTimeout(() => {
        setHidden(true);
        setErrorMessage('');
      }, 3000);
    } else {
      setHidden(true);
    }

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [errorMessage, setErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length > 0 && <Section filteredTodos={filteredTodos} />}

        {todos.length > 0 && <Footer />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal${hidden ? ' hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
