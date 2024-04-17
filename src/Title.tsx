import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  setIsEdited: (value: number) => void;
  handleRemoveButton: (
    todo: Todo,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
};

export const Title = ({ todo, setIsEdited, handleRemoveButton }: Props) => {
  return (
    <>
      <span
        data-cy="TodoTitle"
        onDoubleClick={() => setIsEdited(todo.id)}
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        onClick={event => handleRemoveButton(todo, event)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
    </>
  );
};
