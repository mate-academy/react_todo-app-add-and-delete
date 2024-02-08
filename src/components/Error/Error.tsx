/* eslint-disable quote-props */
/* eslint-disable import/no-cycle */
/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { ErrorsContext } from '../../TodosContext/TodosContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  onIsClicked: (clicked: boolean) => void
}

export const Error: React.FC<Props> = ({ onIsClicked }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { newError, showError, setShowError } = useContext(ErrorsContext);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
        setIsClicked(!isClicked);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showError]);

  const handleButtonClick = () => {
    onIsClicked(true);
    setShowError(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          'hidden': !showError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleButtonClick}
        disabled={isClicked}
      />
      {`${newError}`}
    </div>
  );
};
