import React from 'react';
import { Todo } from '../types/Todo';

type TodoItemFormProps = {
  handleNewTitleSubmit: (
    event: React.FormEvent<HTMLFormElement>, todoId: number,
  ) => Promise<void>,
  todo: Todo,
  handleTodoTitleChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleTitleBlur: (todoId: number) => Promise<void>,
};

export const TodoItemForm: React.FC<TodoItemFormProps> = ({
  handleNewTitleSubmit,
  todo,
  handleTodoTitleChange,
  handleTitleBlur,
}) => {
  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      handleTitleBlur(todo.id);
    }
  };

  return (
    <form onSubmit={
      (event) => {
        handleNewTitleSubmit(event, todo.id);
      }
    }
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        defaultValue={todo.title}
        onChange={(event) => handleTodoTitleChange(event)}
        onBlur={() => handleTitleBlur(todo.id)}
        onKeyUp={(event) => handleKeyUp(event)}
      />
    </form>
  );
};
