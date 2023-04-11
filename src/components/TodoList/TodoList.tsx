import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (id: number) => void;
}
export const TodosList: FC<Props> = ({ todos, removeTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={removeTodo}
        />
      ))}
    </section>
  );
};
