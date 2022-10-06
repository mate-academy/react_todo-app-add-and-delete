import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

import '../../styles/transition.scss';

type Props = {
  todos: Todo[];
  newTitle: string;
  onStatusChange: (id: number, property: Partial<Todo>) => void;
  onDelete: (id: number[]) => void;
  isAdding:boolean,
  loadingTodoIds: number[],
};

export const TodosList: React.FC<Props> = ({
  todos,
  newTitle,
  onStatusChange,
  onDelete,
  isAdding,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              loadingTodoIds={loadingTodoIds}
              isAdding={isAdding}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={Math.random()}
              todo={{
                id: 0,
                title: newTitle,
                completed: false,
                userId: Math.random(),
              }}
              loadingTodoIds={loadingTodoIds}
              onStatusChange={onStatusChange}
              isAdding={isAdding}
              onDelete={onDelete}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
