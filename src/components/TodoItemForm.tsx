import React from 'react';
import { Todo } from '../types/Todo';

type TodoItemFormProps = {
  // define props here
  handleNewTitleSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void>,
  todo: Todo,
  handleTodoTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleTitleBlur: () => Promise<void>,
};

export const TodoItemForm: React.FC<TodoItemFormProps> = ({
  handleNewTitleSubmit,
  todo,
  handleTodoTitleChange,
  handleTitleBlur,
}) => {
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleTitleBlur();
    }
  };

  return (
    <form onSubmit={
      (event) => {
        handleNewTitleSubmit(event);
      }
    }
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        defaultValue={todo.title}
        onChange={(event) => handleTodoTitleChange(event)}
        onBlur={() => handleTitleBlur()}
        onKeyUp={(event) => handleKeyUp(event)}
      />
    </form>
  );
};
