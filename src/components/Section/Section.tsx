import React from 'react';
import { TodoType } from '../../types/TodoType';
import { TodoInfo } from '../TodoInfo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null | undefined;
  isRemoveAll: boolean;
  onDelete: (todoId: number) => void;
};

export const Section: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  isRemoveAll,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isRemoveAll={isRemoveAll}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
