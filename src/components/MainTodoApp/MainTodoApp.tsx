import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { LoadingTodo } from '../LoadingTodo';
import { TodoComponent } from '../TodoComponent/TodoComponent';

interface Props {
  todos: Todo[];
  onRemove: (todoData: Todo) => void;
  tempTodo: Todo | null;
}

export const MainTodoApp: FC<Props> = React.memo(({
  todos,
  onRemove,
  tempTodo,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      tempTodo?.id !== todo.id
        ? (
          <TodoComponent
            key={todo.id}
            todo={todo}
            onRemove={onRemove}
          />
        )
        : <LoadingTodo key={todo.id} todo={tempTodo} />
    ))}

    {todos.every(({ id }) => id !== tempTodo?.id) && tempTodo && (
      <LoadingTodo todo={tempTodo} />
    )}
  </section>
));
