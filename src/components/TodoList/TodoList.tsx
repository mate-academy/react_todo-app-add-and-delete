import { useContext } from 'react';
import { StateContext } from '../../store/Store';
import { TodoItem } from '../TodoItem/TodoItem';
import { handleFilteredTodos } from '../../utils/helpers';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const { todos, sortBy } = useContext(StateContext);

  const filteredTodos = handleFilteredTodos(todos, sortBy);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} />;
      })}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
