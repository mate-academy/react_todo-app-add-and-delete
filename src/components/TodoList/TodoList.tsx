import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  clearingCompleted: boolean,
  deletingTodo: Todo | undefined,
  deleteTodo: (n: number) => void,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  clearingCompleted,
  deletingTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              clearingCompleted={clearingCompleted}
              deletingTodo={deletingTodo}
              deleteTodo={deleteTodo}
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
              clearingCompleted={clearingCompleted}
              deletingTodo={deletingTodo}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
