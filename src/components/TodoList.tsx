import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos : Todo[],
  removeTodo: (value: number) => void,
  tempTodo: Todo | null,
  loadingTodo: number[],
};

export const TodoList: React.FC<Props> = ({
  todos, removeTodo, tempTodo, loadingTodo,
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
              loadingTodo={loadingTodo}
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
              loadingTodo={loadingTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
