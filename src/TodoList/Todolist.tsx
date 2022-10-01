import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleClick: (id: number)=> void;
};

export const TodoList: React.FC<Props> = ({ todos,  handleClick}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo =>
      <TodoItem
        key={todo.id}
        todoItem={todo}
        handleClick={handleClick} />)}
    </section>
  );
};
