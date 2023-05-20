import { FC, useEffect } from 'react';
import { ErrorsType } from '../../types/ErrorsType';

interface Props {
  isError: boolean,
  onHide: () => void,
  errorType: ErrorsType,
}

export const Error: FC<Props> = ({
  isError,
  onHide,
  errorType,
}) => {
  useEffect(() => {
    const errorTimeOut = setTimeout(() => onHide(), 3000);

    return () => {
      clearTimeout(errorTimeOut);
    };
  }, [isError]);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"

    >
      <button
        type="button"
        className="delete"
        onClick={onHide}
        aria-label="Close"
      />
      {errorType}
    </div>
  );
};
