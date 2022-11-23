import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  hasLoadingError: boolean,
  isAddingErrorShown: boolean,
  setHasLoadingError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAddingErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ErrorNotification = ({
  hasLoadingError,
  setHasLoadingError,
  isAddingErrorShown,
  setIsAddingErrorShown,
}: Props) => {
  const [isClosePressed, setIsClosePressed] = useState(false);
  const isErrorHidden = (!hasLoadingError || isClosePressed)
  && !isAddingErrorShown;

  useEffect(() => {
    const setErrors = () => {
      setHasLoadingError(false);
      setIsAddingErrorShown(false);
    };

    const timer = setTimeout(setErrors, 3000);

    return () => clearTimeout(timer);
  }, [isAddingErrorShown]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHidden },
      )}
    >
      <button
        aria-label="delete"
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={() => {
          setIsClosePressed(true);
          setIsAddingErrorShown(false);
        }}
      />
      {hasLoadingError && ('Unable to add your todos')}
      {isAddingErrorShown && !hasLoadingError && ('Title can`t be empty')}
      <br />
    </div>
  );
};
