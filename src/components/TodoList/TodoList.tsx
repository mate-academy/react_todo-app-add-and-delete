import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  isAdding: boolean;
  deletedTodoIDs: number[];
  deleteTodoAtServer: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isAdding,
  deleteTodoAtServer,
  deletedTodoIDs,
}) => {
  const tempTodo = {
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isAdding={deletedTodoIDs.includes(todo.id)}
          deleteTodoAtServer={deleteTodoAtServer}
        />
      ))}
      {isAdding && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isAdding={isAdding}
        />
      )}
    </section>
  );
};
