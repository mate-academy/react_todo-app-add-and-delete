import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => Promise<void | Todo>;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void | Todo>;
  loadingTodoIds: number[];
};

export const TodoList = ({
  todos,
  onDelete,
  onUpdate,
  loadingTodoIds,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              loadingTodoIds={loadingTodoIds}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
