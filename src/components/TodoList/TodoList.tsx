import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  deleteHandler: (todoId: number) => Promise<unknown>;
  completedIsRemoving: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos, deleteHandler, completedIsRemoving,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            deleteHandler={deleteHandler}
            completedIsRemoving={completedIsRemoving}
          />
        );
      })}
    </section>
  );
};
