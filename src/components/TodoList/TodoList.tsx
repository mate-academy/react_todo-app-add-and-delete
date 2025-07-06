import { Todo } from '../../types/Todo';
import { SetStateAction } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  isHover: boolean;
  tempTodo: Todo | null;
  deletedTodoId: number | null;
  setIsHover: React.Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isHover,
  tempTodo,
  deletedTodoId,
  setIsHover,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => (
        <TodoItem
          isTempTodo={false}
          key={todo.id}
          isHover={isHover}
          todo={todo}
          deletedTodoId={deletedTodoId}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isHover={isHover}
          deletedTodoId={deletedTodoId}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
          isTempTodo={true}
        />
      )}
    </section>
  );
};
