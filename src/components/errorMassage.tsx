import cn from 'classnames';
import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMassage: ErrorMessage | null;
  massage: (value: null) => void;
};

export const ErrorMassage: React.FC<Props> = ({ errorMassage, massage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMassage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => massage(null)}
      />
      {errorMassage}
    </div>
  );
};
