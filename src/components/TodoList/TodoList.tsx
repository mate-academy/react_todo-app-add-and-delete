import { useContext } from 'react';

import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosContext';

type Props = {};
export const TodoList: React.FC<Props> = () => {
  const { visibleTodos, tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      { tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} />
      )}
    </section>
  );
};
