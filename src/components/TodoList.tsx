import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  handleDelete: (id: number) => void;
  deletingId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  handleDelete,
  deletingId,
}) => {
  return (
    <section
      className={classNames('todoapp__main', {
        hidden: todos?.length === 0,
      })}
      data-cy="TodoList"
    >
      {!isLoading &&
        todos?.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSubmitting={deletingId.includes(todo.id)}
            handleOnDelete={handleDelete}
          />
        ))}
    </section>
  );
};
