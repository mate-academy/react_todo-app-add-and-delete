import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodosId: number[] | [];
  handleDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletedTodosId,
  handleDeleteTodo,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoItem
          todo={todo}
          deletedTodosId={deletedTodosId}
          handleDeleteTodo={handleDeleteTodo}
        />
      </li>
    ))}

    {!!tempTodo && (
      <TodoItem
        todo={tempTodo}
        deletedTodosId={deletedTodosId}
        handleDeleteTodo={handleDeleteTodo}
      />
    )}
  </ul>
);
