/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import { useContext, useState } from 'react';
import { AppContext } from '../../context';
import { setErrorMessageAction } from '../../services/actions/errorActions';

export const NotificationComponent: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [isHidden, setIsHidden] = useState(false);
  const { errorMessage } = state;
  const handleClick = () => {
    dispatch(setErrorMessageAction(''));
  };

  setTimeout(() => {
    setIsHidden(true);
    setTimeout(() => {
      handleClick();
    }, 1000);
  }, 3000);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleClick}
      />
      {errorMessage}
    </div>
  );
};
