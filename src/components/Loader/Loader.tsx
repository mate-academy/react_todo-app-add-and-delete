import classNames from 'classnames';

type Props = {
  loader: number | null;
  id: number | null;
};

export const Loader: React.FC<Props> = ({ loader, id }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames(`modal overlay`, {
        'is-active': loader === id,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
