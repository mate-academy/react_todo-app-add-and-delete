import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  isLoading: boolean;
  selectedId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  isLoading,
  selectedId,
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
              removeTodo={removeTodo}
              isLoading={isLoading}
              selectedId={selectedId}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
