import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo;
}

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div className="todo">
      {/* This todo is in loadind state */}
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{tempTodo.title}</span>
      <button type="button" className="todo__remove">×</button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
