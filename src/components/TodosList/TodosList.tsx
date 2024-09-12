import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos?.map((todo) => (
        <TodoComponent
          key={todo.id}
          todo={todo}
        />
      ))}
      { tempTodo && (
        <TodoComponent
          key={tempTodo.id}
          todo={tempTodo}
          isTempTodo
        />
      )}
    </ul>
  );
};
