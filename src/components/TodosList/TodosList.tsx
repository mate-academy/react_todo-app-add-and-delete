import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import './item.scss';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removesTodo: (id: number[]) => void;
  loadingTodos: number[];
}

export const TodosList: FC<Props> = ({
  todos,
  tempTodo,
  removesTodo,
  loadingTodos,
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
            <TodoInfo
              todo={todo}
              removesTodo={removesTodo}
              loadingTodos={loadingTodos}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              removesTodo={removesTodo}
              loadingTodos={loadingTodos}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
