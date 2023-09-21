import { CurrentError } from '../../types/CurrentError';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoLoadingItem } from '../TodoLoadingItem/TodoLoadingItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isClearCompleted: boolean
  onChangeStatus: (todoId: number) => void,
  onDeleteTodo: (todoId: number) => void,
  onSetErrorMessage: (error: CurrentError) => void,
  setIsClearCompleted: (isClearCompleted: boolean) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isClearCompleted,
  onDeleteTodo,
  onChangeStatus,
  onSetErrorMessage,
  setIsClearCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isClearCompleted={isClearCompleted}
          onDeleteTodo={onDeleteTodo}
          onChangeStatus={onChangeStatus}
          onSetErrorMessage={onSetErrorMessage}
          setIsClearCompleted={setIsClearCompleted}
        />
      ))}
      {tempTodo && (
        <TodoLoadingItem
          key={tempTodo.id}
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
