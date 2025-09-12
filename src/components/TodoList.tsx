import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (idToDelete: number) => void;
  deletingTodoIds: number[];
  isSubmitting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingTodoIds,
  isSubmitting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              deletingTodoIds={deletingTodoIds}
              tempTodo={tempTodo}
            />
          </CSSTransition>
        ))}

        {isSubmitting && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
