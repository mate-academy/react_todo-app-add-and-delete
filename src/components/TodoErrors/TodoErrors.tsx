import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  error: string,
  setError: (newError: string) => void,
}

export const TodoErrors: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      // eslint-disable-next-line max-len
      className={classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
