import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  onSetDeleteTodoID: React.Dispatch<React.SetStateAction<number | null>>;
  deleteTodoID: number | null;
  isDeletingCompleted: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  onSetDeleteTodoID,
  deleteTodoID,
  isDeletingCompleted,
}) => {
  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onSetDeleteTodoID={onSetDeleteTodoID}
          isLoading={
            todo.id === deleteTodoID
            || (isDeletingCompleted && todo.completed)
          }
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
