/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import { NewFormTodo } from '../NewFormTodo';
import { Todo } from '../../types/Todo';

type Props = {
  isAllTodosActive: boolean,
  isTodosNotEmpty: boolean,
  title: string,
  onTitleChange: (newTitle: string) => void,
  addTodo: (titleTodo: string) => void,
  tempTodo: Todo | null,
};

export const Header: React.FC<Props> = ({
  isAllTodosActive,
  isTodosNotEmpty,
  title,
  onTitleChange,
  addTodo,
  tempTodo,
}) => {
  return (
    <header className="todoapp__header">

      {isTodosNotEmpty && (
        <button
          type="button"
          className={cn('todoapp__toggle-all',
            {
              active: isAllTodosActive,
            })}
        />
      )}

      <NewFormTodo
        title={title}
        onTitleChange={onTitleChange}
        addTodo={addTodo}
        tempTodo={tempTodo}
      />

    </header>
  );
};
