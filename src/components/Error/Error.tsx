/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { ErrorMessages } from '../../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  onIsClicked: (clicked: boolean) => void
}

export const Error: React.FC<Props> = ({ onIsClicked }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (!isClicked) {
      timer = setTimeout(() => {
        onIsClicked(true);
        setIsClicked(!isClicked);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isClicked]);

  const handleButtonClick = () => {
    onIsClicked(true);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleButtonClick}
        disabled={isClicked}
      />
      {`${ErrorMessages.unableToAddTodo}`}
    </div>
  );
};
