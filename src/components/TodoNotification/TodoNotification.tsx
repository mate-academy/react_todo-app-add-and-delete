import classnames from 'classnames';
import { useContext, useEffect } from 'react';
import { ErrorContext } from '../../context/ErrorContext';

export const TodoNotification: React.FC = () => {
  const {
    errorMessage,
    isErrorHidden,
    setIsErrorHidden,
  } = useContext(ErrorContext);

  useEffect(() => {
    if (errorMessage.length !== 0) {
      setIsErrorHidden(false);
    }

    setTimeout(() => {
      setIsErrorHidden(true);
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isErrorHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => setIsErrorHidden(true)}
      />

      {errorMessage}
    </div>
  );
};
