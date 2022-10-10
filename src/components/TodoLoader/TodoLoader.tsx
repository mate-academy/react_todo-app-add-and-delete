import classNames from 'classnames';

interface Props {
  selectedTodo: number[];
  id: number;
}

export const TodoLoader: React.FC<Props> = ({
  selectedTodo,
  id,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal',
        'overlay',
        { 'is-active': selectedTodo.includes(id) || id === 0 },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
