import { Todo } from './types/Todo';
import { Item } from './item';

type Props = {
  visibleTodos: Todo[];
};

export const List = ({ visibleTodos }: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Item todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
