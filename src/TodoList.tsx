// import React, { useState } from 'react';
import { TodoInfo } from './TodoInfo';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

type Props = {
  todosToShow: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main">
      {todosToShow.map(todo => (
        <TodoInfo
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
        />
      ))}
      {tempTodo && <TodoItem tempTodo={tempTodo} />}
    </section>
  );
};
