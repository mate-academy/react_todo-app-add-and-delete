/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { Todo } from '../../../types/Todo';
import { Todo as TodoItem } from '../Todo/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  isUpdatingTodoId: number,
};

export const TodoAppBody: React.FC<Props> = ({
  todos,
  onDelete,
  isUpdatingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo: Todo) => {
        const { title, id, completed } = todo;

        return (
          <TodoItem
            key={id}
            title={title}
            id={id}
            completed={completed}
            onDelete={onDelete}
            isUpdatingTodoId={isUpdatingTodoId}
          />
        );
      })}
    </section>
  );
};
