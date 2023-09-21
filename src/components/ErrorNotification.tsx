import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';

export const ErrorNotification = () => {
  const { errorMessage } = useContext(GlobalContext);
  const [isHidden, setIsHidden] = useState(false);
  const onHiddenSetter = () => {
    setIsHidden(true);
  };

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
      hidden={isHidden}
    >
      <button
        type="button"
        className="delete"
        onClick={onHiddenSetter}
        aria-label="Close notification"
      />
      {errorMessage}
    </div>
  );
};
