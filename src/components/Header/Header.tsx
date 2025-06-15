import React from 'react';
import { ToggleAll } from '../ToggleAll/ToggleAll';
import { TodoInput } from '../TodoInput/TodoInput';

type Props = {
  newTodoTitle: string;
  onTitleChange: (title: string) => void;
  onAddTodo: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  allCompleted: boolean;
  onToggleAll: () => void;
  isDisabled: boolean;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  onTitleChange,
  onAddTodo,
  inputRef,
  allCompleted,
  onToggleAll,
  isDisabled,
  isAdding,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo(newTodoTitle);
  };

  return (
    <header className="todoapp__header">
      <ToggleAll
        allCompleted={allCompleted}
        toggleAllTodos={onToggleAll}
        isLoading={isDisabled}
      />

      <TodoInput
        newTodoTitle={newTodoTitle}
        onTitleChange={onTitleChange}
        onSubmit={handleSubmit}
        inputRef={inputRef}
        isAdding={isAdding}
      />
    </header>
  );
};
