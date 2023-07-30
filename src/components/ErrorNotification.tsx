/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../context/TodoContext';

type Props = {
  toHideError: boolean,
  setToHideError: (boolean: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  toHideError,
  setToHideError,
}) => {
  const [, ,errorMsg, setErrorMsg] = useContext(TodosContext);

  const hideError = () => {
    setToHideError(true);

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: toHideError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={hideError}
      />
      {errorMsg}
    </div>
  );
};
