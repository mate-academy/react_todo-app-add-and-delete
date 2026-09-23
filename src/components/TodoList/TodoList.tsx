import { Todo } from '../../types/Todo';
import { TodoComponent } from '../Todo/TodoComponent';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todo: Todo) => Promise<unknown>;
  deleteQueue: Todo[];
  onToggle: (todo: Todo) => Promise<unknown>;
  toggleQueue: Todo[];
  handleUpdate: (todo: Todo, newTitle: string) => Promise<boolean>;
};

export const TodoList = ({
  todos,
  tempTodo,
  onDelete,
  deleteQueue,
  onToggle,
  toggleQueue,
  handleUpdate,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoComponent
            todo={todo}
            onDelete={onDelete}
            deleteQueue={deleteQueue}
            key={todo.id}
            onToggle={onToggle}
            toggleQueue={toggleQueue}
            handleUpdate={handleUpdate}
          />
        );
      })}

      {tempTodo !== null && <TodoComponent todo={tempTodo} isTemp={true} />}
    </section>
  );
};
