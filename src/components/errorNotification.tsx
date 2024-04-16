import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from './todosContext';

export const ErrorNotification: React.FC = ({}) => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  const errorMessageClass = classNames({
    notification: true,
    'is-danger': true,
    'is-light': true,
    'has-text-weight-normal': true,
    hidden: errorMessage === '',
  });

  const handleCloseError = () => {
    setErrorMessage('');
  };

  return (
    <div data-cy="ErrorNotification" className={errorMessageClass}>
      <button
        onClick={handleCloseError}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
