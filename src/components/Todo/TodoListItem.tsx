import cl from 'classnames';

type Props = {
  title: string;
  status: boolean;
  changeStatus?: (stat: boolean) => void;
};

export const TodoListItem: React.FC<Props> = ({ title, status }) => {
  // const checkBoxChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {

  // }

  return (
    <div data-cy="Todo" className={cl('todo', { completed: status })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          aria-label="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={status}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
