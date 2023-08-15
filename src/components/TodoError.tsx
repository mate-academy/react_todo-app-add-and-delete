import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Error, errorMapping } from '../utils/collection';
import '../styles/transition.scss';

type Props = {
  currentError: Error
  setCurrentError: (value: Error) => void
};

export const TodoError: React.FC<Props> = ({
  currentError,
  setCurrentError,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage(errorMapping[currentError]);
  }, [currentError]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentError(Error.NOTHING);
    }, 3000);
  }, [currentError]);

  return (
    <TransitionGroup
      component={null}
    >
      {currentError !== Error.NOTHING && (
        <CSSTransition
          timeout={2000}
          classNames="error"
        >
          <div
            className={cn(
              'notification is-danger is-light has-text-weight-normal',
              {
                hidden: !currentError,
              },
            )}
          >
            <button
              type="button"
              className="delete"
              aria-label="delete"
              onClick={() => {
                setCurrentError(Error.NOTHING);
              }}
            />
            {errorMessage}
          </div>
        </CSSTransition>
      )}

    </TransitionGroup>
  );
};
