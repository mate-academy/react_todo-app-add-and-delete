import cn from 'classnames';
import React from 'react';
import { InputForm } from '../InputForm/InputForm';
import { Errors } from '../../utils/Errors';
import { Todo } from '../../types/Todo';

interface Props {
  unfinishedTodoAmount: number;
  todosLength: number;
  setErrorMessage: (error: Errors) => void;
  setTempTodo: (todo: Todo | null) => void;
  onAddTodo: (newTodo: Todo) => void;
  tempTodo: Todo | null;
}

export const Header: React.FC<Props> = ({
  todosLength,
  unfinishedTodoAmount,
  setErrorMessage,
  setTempTodo,
  onAddTodo,
  tempTodo,
}) => {
  const areAllTodoCompleted = unfinishedTodoAmount === 0;

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodoCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}
      <InputForm
        setErrorMessage={setErrorMessage}
        setTempTodo={setTempTodo}
        onAddTodo={onAddTodo}
        tempTodo={tempTodo}
        todosLength={todosLength}
      />
    </header>
  );
};
