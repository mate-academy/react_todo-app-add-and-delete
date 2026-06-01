import React from 'react';
import cn from 'classnames';
import { TypeErroros } from '../types/Errors';
type Props = {
  error: TypeErroros;
  setError: React.Dispatch<React.SetStateAction<TypeErroros>>;
};

export const Errors: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === TypeErroros.Normal,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(TypeErroros.Normal)}
      />
      <>{error}</>
    </div>
  );
};
