import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todoTemp: Todo | null;
  onDelete: (id: number) => Promise<void>;
  isAdding: boolean;
  activeTodoID: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoTemp,
  onDelete,
  activeTodoID,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          activeTodoID={activeTodoID}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          key={todoTemp.id}
          onDelete={onDelete}
          activeTodoID={activeTodoID}
        />
      )}
    </section>
  );
};
