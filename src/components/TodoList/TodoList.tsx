import { TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type TodoListProps = {
  todos: TodoType[];
};

export const TodoList = ({ todos }: TodoListProps) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => <Todo key={todo.id} todo={todo} />)
      }
    </section>
  );
};
