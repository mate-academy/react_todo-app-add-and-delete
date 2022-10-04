import { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorNotification: string;
  setErrorNotification: (value: string) => void;
  isErrorShown: boolean;
  setIsErrorShown: (value: boolean) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorNotification,
  setErrorNotification,
  isErrorShown,
  setIsErrorShown,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorNotification('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorNotification]);

  return (
    <>
      {errorNotification && (
        <div
          data-cy="ErrorNotification"
          className={
            classNames(
              'notification is-danger is-light has-text-weight-normal',
              {
                hidden: isErrorShown,
              },
            )
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            aria-label="delete"
            onClick={() => setIsErrorShown(true)}
          />
          {errorNotification}
        </div>
      )}
    </>
  );
};
