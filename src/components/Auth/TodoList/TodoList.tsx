import React from 'react';

import { Todo } from '../../../types/Todo';
import { TempTodo } from '../TempTodo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  tempTodoTitle: string;
  onDelete: (id: number) => void;
  deletingId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  tempTodoTitle,
  onDelete,
  deletingId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        deletingId={deletingId}
      />
    ))}

    {isAdding && <TempTodo tempTodoTitle={tempTodoTitle} />}
  </section>
);
