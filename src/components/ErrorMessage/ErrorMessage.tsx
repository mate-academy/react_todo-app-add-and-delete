import cn from 'classnames';
import { useEffect } from 'react';

interface Props {
  errorMessage: string,
  isErrorShown: boolean,
  onErrorHiding: () => void,
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  isErrorShown,
  onErrorHiding,
}) => {
  const handleErrorHiding = () => {
    onErrorHiding();
  };

  useEffect(() => {
    setTimeout(() => {
      onErrorHiding();
    }, 2000);
  }, [errorMessage, onErrorHiding]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isErrorShown,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label  */}
      <button
        onClick={handleErrorHiding}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
