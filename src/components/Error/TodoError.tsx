import classNames from 'classnames';
import { useAppContextContainer } from '../../context/AppContext';

type Props = {
  error: string | null;
};

const TodoError = ({ error }: Props) => {
  const { handleClickCloseError } = useAppContextContainer();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClickCloseError}
      />
      {error}
    </div>
  );
};

export default TodoError;
