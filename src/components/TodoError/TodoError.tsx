import classNames from 'classnames';
import { TodoErrorMessages } from '../../types/Todo';

type Props = {
  errorMessage: TodoErrorMessages;
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoErrorMessages>>;
};

export const TodoError: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      // eslint-disable-next-line max-len
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        // TODO: maybe change to boolean state to not have cut text error effect
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
