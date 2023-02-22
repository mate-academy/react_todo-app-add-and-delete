import React, {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  errorMessage: string,
  setErrorMessage: Dispatch<SetStateAction<string>>,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const handleCloseClick = () => {
    setIsHidden(true);
    setErrorMessage(ErrorMessages.NOERROR);
  };

  const closeNotification = useCallback(debounce(handleCloseClick, 3000), []);

  if (!isHidden) {
    closeNotification();
  }

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      <button
        type="button"
        aria-label="Close notification"
        className="delete"
        onClick={handleCloseClick}
      />

      {/* show only one message at a time */}
      { errorMessage }
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
