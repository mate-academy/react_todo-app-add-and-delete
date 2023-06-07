/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  handleSetError: (value: string) => void
  errorMess: string
}

export const ErrorMessage: React.FC<Props>
  = ({ handleSetError, errorMess }) => {
    return (
      <div className="notification is-danger is-light has-text-weight-normal">
        <button
          type="button"
          className="delete"
          onClick={() => handleSetError('')}
        />

        {errorMess}
      </div>
    );
  };
