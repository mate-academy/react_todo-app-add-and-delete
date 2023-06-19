import { FC, memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import '../../App.scss';
import { TodosListProps } from './TodosListProps';

export const TodosList: FC<TodosListProps> = memo(({
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
});
