import classNames from 'classnames';
import { useEffect } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  isError: boolean,
  errorMessage: string,
  setNotification: (value: string) => void
};

export const TodoNotification:React.FC<Props> = ({
  isError,
  errorMessage,
  setNotification,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setNotification('');
    }, 3000);
  }, [isError]);

  return (
    <div
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !isError,
        })
      }
    >
      <button
        type="button"
        className="delete"
        onClick={() => setNotification('')}
      />
      {errorMessage}
    </div>
  );
};
