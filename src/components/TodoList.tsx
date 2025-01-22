// #region imports
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
// #endregion

// #region type Props
type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number[]) => void;
  isLoading: boolean;
  loadingTodoIds: number[];
};
// #endregion

export default function TodoList({
  filteredTodos,
  onDelete,
  tempTodo,
  isLoading,
  loadingTodoIds,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading={isLoading} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
}
