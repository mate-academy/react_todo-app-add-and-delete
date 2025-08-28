import classNames from 'classnames';

type Props = {
  isLoading: boolean;
};
function TodoLoader({ isLoading }: Props) {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
}

export default TodoLoader;
