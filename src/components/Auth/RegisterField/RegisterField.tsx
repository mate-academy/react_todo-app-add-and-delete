import classNames from 'classnames';

type Props = {
  loading: boolean,
  errorMessage: string,
  needToRegister: boolean,
  name: string,
  setName: (e: string) => void,
};

export const RegisterField: React.FC<Props> = ({
  loading,
  errorMessage,
  needToRegister,
  name,
  setName,
}) => {
  return (
    <div className="field">
      <label className="label" htmlFor="user-name">
        Your Name
      </label>

      <div
        className={classNames('control has-icons-left', {
          'is-loading': loading,
        })}
      >
        <input
          type="text"
          id="user-name"
          className={classNames('input', {
            'is-danger': needToRegister && errorMessage,
          })}
          placeholder="Enter your name"
          required
          minLength={4}
          disabled={loading}
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <span className="icon is-small is-left">
          <i className="fas fa-user" />
        </span>
      </div>

      {needToRegister && errorMessage && (
        <p className="help is-danger">{errorMessage}</p>
      )}
    </div>
  );
};
