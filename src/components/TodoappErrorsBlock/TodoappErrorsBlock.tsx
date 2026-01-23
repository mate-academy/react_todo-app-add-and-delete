import cl from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: string;
  onDelete: (value: ErrorMessage | '') => void;
};

export const TodoappErrorsBlock: React.FC<Props> = ({
  errorMessage,
  onDelete,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cl('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onDelete('')}
      />
      {errorMessage}
    </div>
  );
};
