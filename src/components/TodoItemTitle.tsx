import React from 'react';
import { Todo } from '../types/Todo';

type TodoItemTitleProps = {
  // define props here
  todo: Todo,
  setActiveTodoId: React.Dispatch<React.SetStateAction<number>>,
  handleTodoDelete: (todoId: number) => Promise<void>,
};

export const TodoItemTitle: React.FC<TodoItemTitleProps> = ({
  todo, setActiveTodoId, handleTodoDelete,
}) => {
  const handleTodoKeyDown = (
    event: React.KeyboardEvent<HTMLSpanElement>, todoId: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setActiveTodoId(todoId);
    }
  };

  return (
    <>
      <span
        className="todo__title"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => handleTodoKeyDown(event, todo.id)}
        onDoubleClick={(event) => {
          event.preventDefault();
          setActiveTodoId(todo.id);
        }}
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>
    </>
  );
};
