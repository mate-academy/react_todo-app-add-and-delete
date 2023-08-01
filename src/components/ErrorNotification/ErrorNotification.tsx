import cn from 'classnames';
import { useEffect } from 'react';
import { useAppContext } from '../Context/AppContext';

export const ErrorNotification = () => {
  const {
    errorType,
    setErrorType,
  } = useAppContext();

  useEffect(() => {
    if (errorType.length) {
      setTimeout(() => {
        setErrorType('');
      }, 3000);
    }
  }, [errorType]);

  const handleDeleteNotification = () => {
    setErrorType('');
  };

  if (!errorType.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleDeleteNotification}
      />
      {errorType}
    </div>
  );
};
