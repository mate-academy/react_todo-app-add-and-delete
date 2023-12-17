import { useContext } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { AppContext } from '../TodoContext/TodoContext';

type Props = {
  todos: TodoType[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(AppContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && <TodoItem key={tempTodo?.id} todo={tempTodo} />}
    </section>
  );
};
