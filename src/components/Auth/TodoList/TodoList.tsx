import React from 'react';

import { Todo } from '../../../types/Todo';
import { TempTodo } from '../TempTodo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  tempTodoTitle: string;
  handleTodoDeleting: (id: number) => void;
  deletingId: number;
  isCompletedDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  tempTodoTitle,
  handleTodoDeleting,
  deletingId,
  isCompletedDeleting,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        handleTodoDeleting={handleTodoDeleting}
        deletingId={deletingId}
        isCompletedDeleting={isCompletedDeleting}
      />
    ))}

    {isAdding && <TempTodo tempTodoTitle={tempTodoTitle} />}
  </section>
);
