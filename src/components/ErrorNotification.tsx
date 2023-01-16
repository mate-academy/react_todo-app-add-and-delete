/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

type Props = {
  isHidden: boolean;
  setIsHidden: (arg: boolean) => void;
  onError: string;
};

export const ErrorNotification: React.FC<Props> = (
  {
    isHidden,
    setIsHidden,
    onError,
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
      {onError === 'add' && 'Unable to add a todo'}

      {onError === 'delete' && 'Unable to delete a todo'}

      {onError === 'update' && 'Unable to update a todo'}

      {onError === 'emty' && 'Title can\'t be empty'}
    </div>
  );
};
