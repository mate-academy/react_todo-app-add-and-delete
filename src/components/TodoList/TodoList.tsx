import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  completedTodoIdList: number[],
  onRemoveButtonClick: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  completedTodoIdList,
  onRemoveButtonClick,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveButtonClick={onRemoveButtonClick}
          isProcessing={completedTodoIdList.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isProcessing />
      )}
    </section>
  );
};
