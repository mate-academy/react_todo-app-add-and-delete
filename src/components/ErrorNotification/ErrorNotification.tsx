import { useContext, useEffect, useState } from 'react';
import { Error } from '../../types/Error';
import { TodosContext } from '../TodosContext';

type Props = {};
/* eslint-disable jsx-a11y/control-has-associated-label */

export const ErrorNotification: React.FC<Props> = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (errorMessage !== Error.Default) {
      setHidden(false);
    }

    const timer = setTimeout(() => {
      setErrorMessage(Error.Default);
      setHidden(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  if (hidden) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHidden(true)}
      />
    </div>
  );
};
