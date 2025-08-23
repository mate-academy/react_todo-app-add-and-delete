import cn from 'classnames';

interface Props {
  errorMessage: string;
  onClose: () => void;
}

export const Errormessage: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  // const [testError, setTestError] = useState('');

  // useEffect(() => {
  //   if (isError) {
  //     setErrorMessage(ErrorMessages.LOAD_FAILED);
  //     const timer = setTimeout(() => {
  //       setErrorMessage('');
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [isError]);

  // const handleTestClose = () => {
  //   setTestError(false);
  // };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
        // onClick={handleTestClose}
      />
      {errorMessage}
    </div>
  );
};
