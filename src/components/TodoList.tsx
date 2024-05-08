import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosToShow: Todo[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ todosToShow, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToShow.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo !== null && <TodoItem todo={tempTodo} />}
    </section>
  );
};
