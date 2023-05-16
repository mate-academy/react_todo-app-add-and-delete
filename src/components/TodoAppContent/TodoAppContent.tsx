import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  onDeleteClick: (id: number) => void;
};

export const TodoAppContent: React.FC<Props> = ({
  todoList,
  tempTodo,
  onDeleteClick,
}) => {
  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteClick={onDeleteClick}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} onDeleteClick={onDeleteClick} />
      )}
    </section>
  );
};
