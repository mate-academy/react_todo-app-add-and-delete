import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
