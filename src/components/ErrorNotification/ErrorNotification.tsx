/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  isError: boolean
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  typeError: string
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  onSetIsError,
  typeError,
}) => {
  useEffect(() => {
    onSetIsError(isError);
    if (isError) {
      setTimeout(() => {
        onSetIsError(true);
      }, 3000);
    }
  }, [isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={isError}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetIsError(true)}
      />

      {typeError === `${Errors.ErrGET}`
        && <>{Errors.ErrGET}</>}
      {typeError === `${Errors.ErrBlankTitle}`
        && <>{Errors.ErrBlankTitle}</>}
      <br />
      {typeError === `${Errors.ErrADD}`
        && <>{Errors.ErrADD}</>}
      <br />
      {typeError === `${Errors.ErrDEL}`
        && <>{Errors.ErrDEL}</>}
      <br />
      {typeError === `${Errors.ErrUPD}`
        && <>{Errors.ErrUPD}</>}
    </div>
  );
};
