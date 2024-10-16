import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';

import { Errors } from '../../types/ErrorsEnum';

interface Props {
  errorNotification: Errors;
  setErrorNotification: Dispatch<SetStateAction<Errors>>;
}

export const ErrorNotifications: React.FC<Props> = ({
  errorNotification,
  setErrorNotification,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorNotification === Errors.DEFAULT,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorNotification(Errors.DEFAULT)}
      />
      {errorNotification}
    </div>
  );
};
