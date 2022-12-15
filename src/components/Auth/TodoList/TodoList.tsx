import { Todo } from '../../../types/Todo';
import { TodoInfo } from '../TodoInfo/todoinfo';

type Props = {
  todos: Todo[]
  handleDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, handleDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDelete={handleDelete}
        />
      ))}
    </section>
  );
};
