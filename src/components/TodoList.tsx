import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[]
};

export const TodoList:React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo, index) => (
        <TodoItem todo={todo} id={index} key={todo.id} />
      ))}
    </section>
  );
};
