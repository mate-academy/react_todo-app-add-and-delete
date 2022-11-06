import classNames from 'classnames';
import { useEffect } from 'react';
import { Errors } from '../../types/Errors';

interface Props {
  errorNotification: Errors | null;
  changeErrors: (errors: Errors | null) => void;
}

export const TodoErrorNotification: React.FC<Props> = ({
  errorNotification,
  changeErrors,
}) => {
  useEffect(() => {
    const timeId = setTimeout(() => {
      changeErrors(null);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [errorNotification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorNotification })}
    >
      <button
        aria-label="Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => changeErrors(null)}
      />
      {errorNotification}
    </div>
  );
};
