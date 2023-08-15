import { useEffect } from 'react';
import cn from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: string;
  onError: (e: Error) => void;
};

export const TodosError: React.FC<Props> = ({ errorMessage, onError }) => {
  const hideNotification = () => {
    onError(Error.None);
  };

  const handleDeleteButtonClick = () => {
    hideNotification();
  };

  useEffect(() => {
    setTimeout(() => {
      hideNotification();
    }, 3000);
  });

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: Error.None })}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete error message"
        onClick={handleDeleteButtonClick}
      />
      {errorMessage}
    </div>
  );
};
