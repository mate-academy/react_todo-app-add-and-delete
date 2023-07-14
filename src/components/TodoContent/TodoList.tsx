import { FC, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoContext } from '../TodoContext';
import { TodoInfo } from './TodoInfo';

export const TodoList: FC = () => {
  const { todos, tempTodo, isLoading } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo todo={tempTodo} isLoading={isLoading} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
