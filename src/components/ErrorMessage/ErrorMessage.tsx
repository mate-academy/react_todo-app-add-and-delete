import classNames from 'classnames';
import { getMessage } from './service';
import { ErrorType } from '../../types/Error';
import { useEffect, useState } from 'react';

type ErrorProps = {
  error: ErrorType;
};

const ErrorMessage: React.FC<ErrorProps> = ({ error }) => {
  const [isVisible, setIsVisible] = useState(error.isVisible);

  useEffect(() => {
    setIsVisible(error.isVisible);
  }, [error.isVisible]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      {getMessage(error)}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsVisible(false)}
      />
    </div>
  );
};

export default ErrorMessage;
