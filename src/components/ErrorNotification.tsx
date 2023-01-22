/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  isHidden: boolean;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
  error: ErrorType | null;
};

export const ErrorNotification: React.FC<Props> = (
  {
    isHidden,
    setIsHidden,
    error,
  },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error === ErrorType.load && 'Unable to load a todos'}

      {error === ErrorType.add && 'Unable to add a todo'}

      {error === ErrorType.delete && 'Unable to delete a todo'}

      {error === ErrorType.update && 'Unable to update a todo'}

      {error === ErrorType.empty && 'Title can\'t be empty'}
    </div>
  );
};
