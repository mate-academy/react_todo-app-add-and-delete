import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  onTodoCompleteChange: (todoId: number, completed: boolean) => void;
  onTodoRemove: (todoId: number) => void;
  filterType: FilterType;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo,
  onTodoCompleteChange,
  onTodoRemove,
  filterType,
}) => {
  function isTodoVisible(todo: Todo): boolean {
    switch (filterType) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.filter(isTodoVisible).map((todo: Todo) => {
        return (
          <TodoItem
            todo={todo}
            onTodoCompleteChange={onTodoCompleteChange}
            onTodoRemove={onTodoRemove}
            isLoading={loadingTodoIds.includes(todo.id)}
            key={todo.id}
          />
        );
      })}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          onTodoCompleteChange={onTodoCompleteChange}
          onTodoRemove={onTodoRemove}
          isLoading
        />
      )}
    </section>
  );
};
