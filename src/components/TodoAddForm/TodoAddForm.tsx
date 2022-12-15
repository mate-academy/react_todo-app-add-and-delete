import React, { useEffect, useRef } from 'react';

interface Props {
  newTodoTitle: string;
  onTodoTitleChange: (newTitle: string) => void;
  onTodoAdd: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
}

export const TodoAddForm: React.FC<Props> = (props) => {
  const {
    newTodoTitle,
    onTodoTitleChange,
    onTodoAdd,
    isAdding,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [newTodoTitle]);

  return (
    <form
      onSubmit={onTodoAdd}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => onTodoTitleChange(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
