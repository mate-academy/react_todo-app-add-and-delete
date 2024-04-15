import classNames from 'classnames';
import { ErrorConstext } from './errorMessageContext';
import { useContext } from 'react';

export const ErrorNotification: React.FC = ({}) => {
  const { errorMessage, setErrorMessage } = useContext(ErrorConstext);
  const errorMessageClass = classNames({
    notification: true,
    'is-danger': true,
    'is-light': true,
    'has-text-weight-normal': true,
    hidden: errorMessage === '',
  });

  return (
    <div data-cy="ErrorNotification" className={errorMessageClass}>
      <button
        onClick={() => setErrorMessage('')}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};

// Unable to load todos
// Title should not be empty
// Unable to add a todo
// Unable to delete a todo
// Unable to update a todo
