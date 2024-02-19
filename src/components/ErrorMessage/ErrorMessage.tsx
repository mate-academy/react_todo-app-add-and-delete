import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodosContext } from '../../utils/context';

type Props = {
  isErrorVisible: boolean;
  errorMessage: string;
  setIsErrorVisible: (a: boolean) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
}) => {
  const { isErrorVisible, setIsErrorVisible } = useContext(TodosContext);
  const handleCloseErrorOnClick = () => {
    setIsErrorVisible(!isErrorVisible);
  };

  useEffect(() => {
    if (isErrorVisible) {
      setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);
    }
  }, [isErrorVisible, setIsErrorVisible]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isErrorVisible === false },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseErrorOnClick}
        aria-label="Close Error"
      />
      {errorMessage}
    </div>
  );
};
