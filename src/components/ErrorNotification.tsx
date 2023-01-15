import { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  isError: string;
  setIsError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ isError, setIsError }) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsError();
    }, 3000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal',
          { hidden: !isError })
      }
    >
      <button
        data-cy="HideErrorButton"
        aria-label="delete"
        type="button"
        className="delete"
        onClick={setIsError}
      />
      {isError}
    </div>
  );
};
