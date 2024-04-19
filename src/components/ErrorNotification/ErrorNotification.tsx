import classNames from 'classnames';
import { useContext } from 'react';
import { todosContext } from '../../Store';

type Props = { errorMessage: string };

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  const { setErrorMessage } = useContext(todosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
