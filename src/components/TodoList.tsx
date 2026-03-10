import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  handleOnDelete: (id: number) => void;
  deletingId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  handleOnDelete,
  deletingId,
}) => {
  return (
    <section
      className={classNames('todoapp__main', { hidden: todos?.length === 0 })}
      data-cy="TodoList"
    >
      {!isLoading &&
        todos?.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            isSubmiting={deletingId.includes(todo.id)}
            handleOnDelete={handleOnDelete}
          />
        ))}
    </section>
  );
};
