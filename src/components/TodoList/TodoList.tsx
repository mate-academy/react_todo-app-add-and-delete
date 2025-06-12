import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoadingTemp: boolean;
  onDeleteTodo: (todoId: number) => void;
  deletingId: number | null;
  isMassDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoadingTemp,
  onDeleteTodo,
  deletingId,
  isMassDeleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDeleteTodo}
              loading={todo.id === deletingId || isMassDeleting}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} loading={isLoadingTemp} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
