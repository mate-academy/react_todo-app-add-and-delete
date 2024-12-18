import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  isDataLoading: boolean;
  deletingTodosIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const { todos, onDeleteTodo, isDataLoading, deletingTodosIds, tempTodo } =
    props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isDataLoading={isDataLoading}
          isDeleting={deletingTodosIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} onDeleteTodo={onDeleteTodo} />}
    </section>
  );
};
