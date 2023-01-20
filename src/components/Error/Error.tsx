import { useContext, useEffect } from 'react';
import { ErrorContextType } from '../../types/ErrorContextType';
import { ErrorContext } from './ErrorContext';

const Error:React.FC<{}> = () => {
  const { isError, setIsError, errorText }
  = useContext(ErrorContext) as ErrorContextType;

  useEffect(() => {
    const timeId = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!isError && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close error"
        onClick={() => {
          setIsError(false);
        }}
      />

      {errorText}
    </div>
  );
};

export default Error;
