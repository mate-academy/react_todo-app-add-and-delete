/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorNotification: React.FC<{
  errorMessage: string,
}> = ({
  errorMessage,
}) => {
  return (
    <>
      (
      <div className="notification is-danger is-light has-text-weight-normal">
        <button type="button" className="delete" />

        {errorMessage}
      </div>
      )
    </>
  );
};
