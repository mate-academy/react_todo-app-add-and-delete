/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useTodoContext } from '../../context/TodosProvider';

export const Error: React.FC = () => {
  const { messageError, setMessageError } = useTodoContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !messageError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setMessageError('')}
      />
      {messageError}
    </div>
  );
};
