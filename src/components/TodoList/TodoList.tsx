import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { AppContext } from '../../contexts/appContext';

interface Props {
  todosToView: Todo[],
}

export const TodoList: React.FC<Props> = ({ todosToView }) => {
  const { tempTodo } = useContext(AppContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToView.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && (
        <TodoItem key={tempTodo?.id} todo={tempTodo} />
      )}
    </section>
  );
};
