import { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
};

const Warning: React.FC<Props> = ({ message }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (message) {
      setIsShown(true);
      timer = setTimeout(() => {
        setIsShown(false);
      }, 3000);
    } else {
      setIsShown(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
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
