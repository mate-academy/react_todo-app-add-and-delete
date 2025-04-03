import '../../styles/todoapp.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todoList: Todo[];
  onRemoveItem: (todo: Todo) => void;
  todosToLoading: Todo[];
}

export const TodoList: React.FC<Props> = ({
  todoList,
  onRemoveItem,
  todosToLoading: loadingItems,
}) => {
  return (
    <>
      {todoList.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveItem={onRemoveItem}
          isLoading={loadingItems.includes(todo)}
        />
      ))}
    </>
  );
};
