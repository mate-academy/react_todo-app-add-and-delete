import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  onDelete: (arg: number) => void;
  loading: boolean;
  deleteIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete,
  loading,
  deleteIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <TodoItem
            key={id}
            id={id}
            completed={completed}
            title={title}
            onItemDelete={onDelete}
            isItemLoading={loading}
            deleteIds={deleteIds}
          />
        );
      })}
    </section>
  );
};
