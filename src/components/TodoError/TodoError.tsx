import { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
};

export const TodoError: React.FC<Props> = ({ error }) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsHidden(true), 3000);
  }, []);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      {
        hidden: isHidden,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      >
        {}
      </button>

      {error}
    </div>
  );
};
