import { useContext } from 'react';
import { TodosContext } from '../TodosContext';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  tempTodo: any,
  isSubmitting: boolean,
};

export const TodoList: React.FC<Props> = ({ tempTodo, isSubmitting }) => {
  const { visibleTodos } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem todo={todo} isSubmitting={isSubmitting} key={todo.id} />
      ))}

      {isSubmitting && (
        <TodoItem todo={tempTodo} isSubmitting={isSubmitting} />
      )}
    </section>
  );
};
