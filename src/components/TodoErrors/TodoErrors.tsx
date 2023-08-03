/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../TodosContext';

export const TodoErrors: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={
        cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: isHidden },
        )
      }
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
