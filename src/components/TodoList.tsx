import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  todosAreLoadingIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosAreLoadingIds,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          todosAreLoadingIds={todosAreLoadingIds}
        />
      ))}

      {tempTodo && <TempTodo tempTitle={tempTodo.title} />}
    </section>
  );
};
