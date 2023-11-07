import { useEffect } from 'react';
import cn from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  errors: { error: string };
  isErrorActive: boolean;
  setIsErrorActive: (value: boolean) => void;
}

export const Error: React.FC<Props> = ({
  errors,
  isErrorActive,
  setIsErrorActive,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setIsErrorActive(false);
    }, 3000);
  }, [setIsErrorActive]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('is-danger is-light notification has-text-weight-normal', {
        hidden: !isErrorActive,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsErrorActive(false)}
        aria-label="HideErrorButton"
      />
      {/* show only one message at a time */}
      {errors && 'Unable to load todos'}
    </div>
  );
};
