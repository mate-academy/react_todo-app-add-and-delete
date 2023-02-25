import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  error: ErrorTypes | null;
  setIsError: Dispatch<SetStateAction<ErrorTypes | null>>;
};

const errors = {
  [ErrorTypes.Load]: 'Unable to load todos',
  [ErrorTypes.Add]: 'Unable to add a todo',
  [ErrorTypes.Delete]: 'Unable to delete a todo',
  [ErrorTypes.Update]: 'Unable to update a todo',
  [ErrorTypes.Empty]: 'Title can\'t be empty',
};

export const ErrorNotifications: React.FC<Props> = ({
  error,
  setIsError,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setIsError(null)}
      />

      {error && errors[error]}
    </div>
  );
};
