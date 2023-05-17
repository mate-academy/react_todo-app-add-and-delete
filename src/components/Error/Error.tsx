import React, { useEffect, useMemo } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  isError: boolean;
  onClose: () => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  isError,
  onClose,
}) => {
  const errorString = useMemo(() => {
    switch (errorMessage) {
      case ErrorMessage.Add:
      case ErrorMessage.Download:
      case ErrorMessage.Delete:
      case ErrorMessage.Update:
        return `Unable to ${errorMessage} a todo`;
      case ErrorMessage.EmptyTitle:
        return 'Title can\'t be empty';
      default:
        return '';
    }
  }, [errorMessage]);

  useEffect(() => {
    const errorTimeOut = setTimeout(() => onClose(), 3000);

    return () => {
      clearTimeout(errorTimeOut);
    };
  }, [isError]);

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
      )}
      hidden={!isError}
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
        aria-label="Close error message"
      />

      {errorString}
    </div>
  );
};
