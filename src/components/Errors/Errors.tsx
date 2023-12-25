import React, { useEffect } from 'react';
import cn from 'classnames';
import { useAppContext } from '../Context/Context';

export const Errors: React.FC = () => {
  const { errors, setErrors } = useAppContext();

  useEffect(() => {
    setTimeout(() => {
      setErrors(null);
    }, 3000);
  }, [errors, setErrors]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errors },
      )}
    >
      <button
        aria-label="deleteError"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrors(null)}
      />
      {errors}
    </div>
  );
};
