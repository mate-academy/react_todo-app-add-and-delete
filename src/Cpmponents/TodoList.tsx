import { Todo } from '../types/Todo';
import TodoItem from './TodoItem/TodoItem';

type Props = {
  tasks: Todo[];
  handleOnDelete: (postId: number) => void;
  inProcess: number[];
  handleUpdate: (todoId: number, data: Partial<Todo>) => void;
};

const TodoList: React.FC<Props> = ({
  tasks,
  handleOnDelete,
  inProcess,
  handleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tasks.map(task => (
        <TodoItem
          key={task.id}
          todo={task}
          handleOnDelete={handleOnDelete}
          inProcess={inProcess}
          handleUpdate={handleUpdate}
        />
      ))}
    </section>
  );
};

export default TodoList;
