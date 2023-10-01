/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorMessageEnum } from '../../types/ErrorMessageEnum';

interface Props {
  errorMessage: ErrorMessageEnum | '';
  setErrorMessage: React.Dispatch<React.SetStateAction<'' | ErrorMessageEnum>>,
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage = () => { },
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    setIsHidden(!!errorMessage);

    setTimeout(() => {
      setErrorMessage('');
      setIsHidden(false);
    }, 3000);
  }, [errorMessage]);

  const closeErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />

      {errorMessage}
    </div>
  );
};
