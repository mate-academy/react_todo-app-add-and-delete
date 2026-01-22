import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onCancelRename: () => void;
  onRenameDelete: (id: number) => Promise<void>;
  onEditTodo: (id: number, title: string) => Promise<void>;
};

const EMPTY_STRING = '';

export const EditTodo: React.FC<Props> = ({
  todo,
  onCancelRename,
  onRenameDelete,
  onEditTodo,
}) => {
  const { id, title } = todo;
  const inputRef = useRef<HTMLInputElement>(null);
  const [editTitle, setEditTitle] = useState(title);
  const isSubmitting = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = changeEvent.target.value;

    setEditTitle(inputValue);
  };

  const handleRename = () => {
    if (isSubmitting.current) {
      return;
    }

    isSubmitting.current = true;

    const newTitle = editTitle.trim();

    switch (newTitle) {
      case title:
        onCancelRename();
        isSubmitting.current = false;
        break;

      case EMPTY_STRING:
        onRenameDelete(id).finally(() => {
          isSubmitting.current = false;
        });

        break;

      default:
        onEditTodo(id, newTitle).finally(() => {
          isSubmitting.current = false;
        });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleRename();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        ref={inputRef}
        value={editTitle}
        onChange={handleChange}
        onKeyUp={(keyBoardEvent: React.KeyboardEvent<HTMLInputElement>) => {
          if (keyBoardEvent.key === 'Escape') {
            setEditTitle(title);
            onCancelRename();
          }
        }}
        onBlur={handleRename}
      />
    </form>
  );
};
