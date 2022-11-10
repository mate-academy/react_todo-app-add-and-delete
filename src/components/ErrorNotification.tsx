import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErorTypes } from '../types/ErrorTypes';

type Props = {
  isErrorMessage: ErorTypes,
  setIsErrorMessage: (value: ErorTypes) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  isErrorMessage, setIsErrorMessage,
}) => {
  const [onCloseError, setOnCloseError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsErrorMessage(ErorTypes.none);
    }, 3000);
  }, [isErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: onCloseError || isErrorMessage === ErorTypes.none },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setOnCloseError(true)}
      />
      {isErrorMessage === ErorTypes.load && ('Unable to load a todo')}
      {isErrorMessage === ErorTypes.upload && ('Unable to add a todo')}
      {isErrorMessage === ErorTypes.delete && ('Unable to delete a todo')}
      {isErrorMessage === ErorTypes.title && ('Title can\'t be empty')}

      <br />
    </div>
  );
};
