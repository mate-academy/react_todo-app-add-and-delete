/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useEffect, useRef, useContext,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from './TodoContext';

export const ErrorNotification: FC = () => {
  const {
    error,
    onErrorChange,
  } = useContext(TodoContext);

  const errorMessage = useRef(error);

  useEffect(() => {
    errorMessage.current = error;

    if (error) {
      setTimeout(() => onErrorChange(null), 3000);
    }
  }, [error]);

  return (
    /* eslint-disable-next-line max-len */
    <div className={classNames('notification is-danger is-light has-text-weight-normal', {
      hidden: !error,
    })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onErrorChange(null)}
      />

      {errorMessage.current || error}
    </div>
  );
};
