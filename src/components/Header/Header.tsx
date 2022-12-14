/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { postTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  onSetTypeError: React.Dispatch<React.SetStateAction<string>>
  userId: number | null
  toLoad:() => Promise<void>
  newTitleTodo: string
  onSetNewTitleTodo: React.Dispatch<React.SetStateAction<string>>
  isAdding: boolean
  onSetIsAdding: React.Dispatch<React.SetStateAction<boolean>>
};

export const Header: React.FC<Props> = ({
  newTodoField,
  onSetIsError,
  onSetTypeError,
  userId,
  toLoad,
  isAdding,
  onSetIsAdding,
  newTitleTodo,
  onSetNewTitleTodo,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitleTodo.trim()) {
      onSetTypeError(Errors.ErrBlankTitle);
      onSetIsError(false);
      onSetNewTitleTodo('');
    }

    const addTodo = async () => {
      if (newTitleTodo && userId) {
        try {
          onSetIsAdding(true);
          await postTodo({
            userId,
            title: newTitleTodo,
            completed: false,
          });
        } catch (inError) {
          onSetIsError(false);
          onSetTypeError(Errors.ErrADD);
        }
      }

      onSetIsAdding(false);
      onSetNewTitleTodo('');
      toLoad();
    };

    addTodo();
  };

  const handleInput = (input: string) => {
    onSetNewTitleTodo(input);
    onSetIsError(true);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitleTodo}
          onChange={(e) => handleInput(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
