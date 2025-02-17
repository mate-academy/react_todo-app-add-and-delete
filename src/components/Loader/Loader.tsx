import classNames from 'classnames';

type Props = {
  loading: boolean;
};

export const Loader = ({ loading }: Props) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': loading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
