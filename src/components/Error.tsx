import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  isError: boolean;
  setIsError: (value: boolean) => void;
  errorType: string;
};

export const Error:React.FC<Props> = ({ isError, setIsError, errorType }) => {
  const handleCloseError = () => {
    setIsError(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsError(false);
    },
    3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete hidden"
        onClick={handleCloseError}
        aria-label="delete"
      />

      {errorType}
    </div>
  );
};
