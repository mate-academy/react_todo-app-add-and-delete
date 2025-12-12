import cn from 'classnames';

type LoaderProps = {
  isLoading: boolean;
};

export const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': isLoading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
