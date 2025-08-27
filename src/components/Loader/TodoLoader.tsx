import cn from 'classnames';
type Props = {
  isLoadingSpinner: boolean;
  isNewTodo: boolean;
};

export const TodoLoader: React.FC<Props> = ({
  isLoadingSpinner,
  isNewTodo,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(' is-overlay', {
        'is-active': isLoadingSpinner && isNewTodo,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};

// className="modal overlay is-active"
