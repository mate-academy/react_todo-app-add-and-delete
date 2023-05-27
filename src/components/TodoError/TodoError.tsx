import { useEffect, useState } from 'react';
import classNames from 'classnames';

type TodoErrorProps = {
  errorMsg: string
};

export const TodoError = ({ errorMsg }: TodoErrorProps) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (errorMsg) {
      setHidden(false);
    }
  }, []);

  return (
    <div
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden },
        )
      }
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHidden(true)}
        aria-label="clear Error notification"
      />

      {errorMsg}
    </div>
  );
};
