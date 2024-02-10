/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';
import { wait } from '../../utils/fetchClient';

export const Error: React.FC = () => {
  const { errorMessage, handleSetErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    wait(3000).then(() => handleSetErrorMessage(ErrorMessage.None));
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleSetErrorMessage(ErrorMessage.None)}
      />
      {errorMessage}
    </div>
  );
};
