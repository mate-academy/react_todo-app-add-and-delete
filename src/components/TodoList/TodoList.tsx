import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (id: number) => Promise<void>,
  tempTodo: Todo | null,
};

export const TodoList: FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem todo={todo} removeTodo={removeTodo} key={todo.id} />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} removeTodo={removeTodo} />
      )}
    </section>
  );
};
