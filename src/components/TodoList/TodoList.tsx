import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  updateTodo: (todo: Todo) => void;
  deletTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({ todos, updateTodo, deletTodo }) => {
  return (
    <>
      {/* This is a completed todo */}
      {todos.map(todo => (
        <section className="todoapp__main" data-cy="TodoList" key={todo.id}>
          <TodoItem todo={todo} updateTodo={updateTodo} deletTodo={deletTodo} />
        </section>
      ))}
    </>
  );
};
