import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';

type Props = {
  list: Todo[];
  onDelete: (id: number) => void;
  idTodo: number;
};

export const ToDoList: React.FC<Props> = ({ list, onDelete, idTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(({ title, id, completed }) => (
        <TodoItem
          key={id}
          id={id}
          title={title}
          completed={completed}
          onDelete={onDelete}
          isActive={id === idTodo}
        />
      ))}
    </section>
  );
};
