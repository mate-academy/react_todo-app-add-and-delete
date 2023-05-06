import React, { useEffect } from 'react';
import { ErrorType } from '../../utils/Enums/ErrorType';

interface Props {
  error: ErrorType;
  handleErrorHide: () => void;
}

export const Error: React.FC<Props> = ({
  error,
  handleErrorHide,
}) => {
  useEffect(() => {
    setTimeout(() => {
      handleErrorHide();
    }, 3000);
  }, [error]);

  return (
    <>
      <button
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={handleErrorHide}
      />
      {error}
    </>
  );
};
