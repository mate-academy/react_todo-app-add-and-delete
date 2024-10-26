import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { useMemo } from 'react';

type Props = {
  currentError: string | null;
};

export const ErrorNotification: React.FC<Props> = ({ currentError }) => {
  const { load, title, add, delete: deleteError, update } = Errors;

  const currentErrorType = useMemo(() => {
    switch (currentError) {
      case load:
        return load;
      case title:
        return title;
      case add:
        return add;
      case deleteError:
        return deleteError;
      case update:
        return update;
      default:
        return null;
    }
  }, [currentError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: currentError === null,
        },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {currentErrorType}
    </div>
  );
};
