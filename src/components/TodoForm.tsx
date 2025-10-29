import { FC, FormEvent, RefObject } from 'react';

type Props = {
  onAdd: (event: FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  title: string;
  isAdding: boolean;
  changeTitle: (newTitle: string) => void;
};

export const TodoForm: FC<Props> = ({
  onAdd,
  inputRef,
  title,
  isAdding,
  changeTitle,
}) => {
  return (
    <form onSubmit={onAdd}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => changeTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
