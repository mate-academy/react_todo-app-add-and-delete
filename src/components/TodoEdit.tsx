/* eslint-disable jsx-a11y/no-autofocus */
import { FC, useState } from 'react';
import { useTodo } from '../providers/TodoProvider';

type Props = {
  todoTitle: string
};

export const TodoEdit: FC<Props> = ({ todoTitle }) => {
  const [title, setTitle] = useState<string>(todoTitle);

  const {
    setModifiedTodo,
  } = useTodo();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBlur = () => {
    setModifiedTodo(null);
  };

  return (
    <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={title}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    </form>
  );
};
