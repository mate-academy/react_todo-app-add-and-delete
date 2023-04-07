/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  errorMessage: string,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
}) => (
  <>
    <div className="notification is-danger is-light has-text-weight-normal">
      <button type="button" className="delete" />

      {errorMessage}
    </div>
  </>
);
