import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (userId: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, deleteTodo, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && <TempTodo tempTitle={tempTodo.title} />}
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} deleteTodo={deleteTodo} />
      ))}
    </section>
  );
};
