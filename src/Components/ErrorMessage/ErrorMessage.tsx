import { useEffect, useState } from 'react';
import { ERROR, ErrorType } from '../../types/Error';
import classNames from 'classnames';

type Props = {
  error: ErrorType;
  setErrorType: (error: ErrorType) => void;
};

export const ErrorMessage: React.FC<Props> = ({ error, setErrorType }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(false);

    if (error !== 'noError') {
      setIsVisible(true);
    }

    setTimeout(() => {
      if (isVisible) {
        setIsVisible(false);
      }
    }, 3000);

    return () => {
      if (isVisible && error !== ERROR.noError) {
        setErrorType(ERROR.noError);
      }
    };
  }, [error, isVisible, setErrorType]);

  const errorClassName = classNames(
    { hidden: !isVisible },
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
  );

  return (
    <div data-cy="ErrorNotification" className={errorClassName}>
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error === 'couldntLoadTodos' && 'Unable to load todos'}
      <br />
      {error === 'noTitle' && 'Title should not be empty'}
      <br />
      {error === 'unableToAdd' && 'Unable to add a todo'}
      <br />
      {error === 'unableToDelete' && 'Unable to delete a todo'}
      <br />
      {error === 'unableToUpdate' && 'Unable to update a todo'}
    </div>
  );
};
