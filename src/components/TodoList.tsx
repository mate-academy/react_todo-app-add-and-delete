import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos : Todo[],
  removeTodo: (value: number) => void,
  isLoading: boolean,
  tempTodo: Todo | null
};

export const TodoList: React.FC<Props> = ({
  todos, removeTodo, isLoading, tempTodo,
}) => {
  return (
    <section className="todoapp__main">
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
              key={todo.id}
              isLoading={isLoading}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              removeTodo={removeTodo}
              isLoading={isLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
