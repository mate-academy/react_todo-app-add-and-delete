import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  hasLoadingError: boolean,
  setHasLoadingError: (arg: boolean) => void,
  isAddingErrorShown: boolean,
  setIsAddingErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ErrorNotification = ({
  hasLoadingError,
  setHasLoadingError,
  isAddingErrorShown,
  setIsAddingErrorShown,
}: Props) => {
  const [isClosePressed, setIsCLosePressed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasLoadingError(false);
      setIsAddingErrorShown(false);
    }, 3000);
  }, [isAddingErrorShown]);

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: (
              !hasLoadingError || isClosePressed
            ) && !isAddingErrorShown,
          },
        )}
      >
        <button
          aria-label="delete"
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => {
            setIsCLosePressed(true);
            setIsAddingErrorShown(false);
          }}
        />
        {hasLoadingError && ('Unable to add your todos')}
        {isAddingErrorShown && !hasLoadingError && ('Title can`t be empty')}
        <br />
      </div>
    </>
  );
};
