import React from 'react';
import classNames from 'classnames';
import { NewTodoInput } from './NewTodoInput';
import { ErrorTypes } from '../types/ErrorTypes';

type HeaderProps = {
  activeTodosQuantity: number;
  handleAddTodo: (title: string) => Promise<void>;
  addTodo: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  handleTodoChange: (id: number, completed: boolean) => void;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<HeaderProps> = ({
  activeTodosQuantity,
  handleAddTodo,
  addTodo,
  setErrorMessage,
  handleTodoChange,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosQuantity,
        })}
        data-cy="ToggleAllButton"
        onClick={() => handleTodoChange(0, activeTodosQuantity === 0)}
      />
      <NewTodoInput
        addTodo={addTodo}
        setErrorMessage={setErrorMessage}
        handleAddTodo={handleAddTodo}
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        inputRef={inputRef}
      />
    </header>
  );
};
