import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleClickDelete: (id: number)=> void;
};

export const TodoList: React.FC<Props> = ({ todos,  handleClickDelete}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo =>
      <TodoItem
        key={todo.id}
        todoItem={todo}
        handleClickDelete={handleClickDelete} />)}
    </section>
  );
};
