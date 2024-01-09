import { useContext, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';

type Props = {
  tempTodo: Todo | null,
};

export const TodosList: React.FC<Props> = ({ tempTodo }) => {
  const { todos, status } = useContext(TodosContext);

  const filteredTodo = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
