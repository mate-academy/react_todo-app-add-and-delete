import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
  isProcessed: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos, deleteTodo, isProcessed, tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              isProcessed={isProcessed.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
              isProcessed={tempTodo !== null}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
