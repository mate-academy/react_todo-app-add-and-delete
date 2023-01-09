import { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
};

const Warning: React.FC<Props> = ({ message }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (message) {
      setIsShown(true);
      setTimeout(() => {
        setIsShown(false);
      }, 3000);
    } else {
      setIsShown(false);
    }
  }, [message]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isShown },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error button"
        onClick={() => {
          setIsShown(false);
        }}
      />

      {message}
    </div>
  );
};

export default Warning;
