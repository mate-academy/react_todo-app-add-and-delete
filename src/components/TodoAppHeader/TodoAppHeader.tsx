import classNames from 'classnames';
import { AddTodoForm } from '../AddTodoForm';
import { RefObject } from 'react';

interface Props {
  allCompleted: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onAddTodo: (title: string) => Promise<void>;
  onError: (message: string) => void;
}

export const TodoAppHeader = ({
  allCompleted,
  inputRef,
  onAddTodo,
  onError,
}: Props) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: allCompleted,
      })}
      data-cy="ToggleAllButton"
    />

    <AddTodoForm onAddTodo={onAddTodo} onError={onError} inputRef={inputRef} />
  </header>
);
