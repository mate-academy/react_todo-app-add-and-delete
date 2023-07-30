import cn from 'classnames';
import { useEffect } from 'react';
import { useAppContext } from '../Context/AppContext';

export const ErrorNotification = () => {
  const {
    isError,
    setIsError,
  } = useAppContext();

  useEffect(() => {
    if (isError.length) {
      setTimeout(() => {
        setIsError('');
      }, 3000);
    }
  }, [isError]);

  const handleDeleteNotification = () => {
    setIsError('');
  };

  if (!isError.length) {
    return <></>;
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
      {`Unable to ${isError} a todo`}
    </div>
  );
};
