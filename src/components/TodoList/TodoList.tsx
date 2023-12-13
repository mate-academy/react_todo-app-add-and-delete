import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todosToView: Todo[];
  deleteTodo: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
}

export const TodoList = ({ todosToView, deleteTodo, tempTodo }: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToView.map(todo => (
        <TodoItem todo={todo} removeTodo={deleteTodo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} removeTodo={deleteTodo} />}
    </section>
  );
};
