import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  temporaryTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  temporaryTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              key={todo.id}
            />
          </CSSTransition>
        ))}

        {temporaryTodo && (
          <CSSTransition
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={temporaryTodo}
              deleteTodo={deleteTodo}
              loader={!!temporaryTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
