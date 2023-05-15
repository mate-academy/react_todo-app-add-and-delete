import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { LoadingTodo } from '../LoadingTodo';
import { TodoComponent } from '../TodoComponent/TodoComponent';

interface Props {
  todos: Todo[];
  removeTodo: (todoData: Todo) => void;
  tempTodo: Todo | null;
  removingTodoId: number | null;
}

export const MainTodoApp: FC<Props> = React.memo(({
  todos,
  removeTodo,
  tempTodo,
  removingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const { id, title } = todo;

        return removingTodoId !== id
          ? <TodoComponent key={id} todo={todo} removeTodo={removeTodo} />
          : <LoadingTodo key={id} title={title} />;
      })}

      {tempTodo && (
        <LoadingTodo title={tempTodo.title} />
      )}
    </section>
  );
});
