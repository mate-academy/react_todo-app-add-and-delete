import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  isError: boolean;
  errorType: string;
  setErrorType: (value: string) => void
};

export const Error:React.FC<Props> = ({ isError, errorType, setErrorType }) => {
  const handleCloseError = () => {
    setErrorType('');
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorType('');
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
