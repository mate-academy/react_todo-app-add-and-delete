import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
};

export const TodoList: FC<Props> = ({ todos, deleteTodo }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
      />
    ))}
  </section>
);
