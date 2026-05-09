import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  filteredTodos: Todo[];
};

export const Section: React.FC<Props> = ({ filteredTodos }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {show &&
          filteredTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
              unmountOnExit
            >
              <TodoItem todo={todo} />
            </CSSTransition>
          ))}
      </TransitionGroup>
    </section>
  );
};
