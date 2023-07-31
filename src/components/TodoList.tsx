import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoContext } from '../context/TodoContext';
import { TodoInfo } from './TodoInfo';

export const TodoList: React.FC = () => {
  const { visibleTodos, loading, todoInCreation } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              key={todo.id}
            />
          </CSSTransition>
        ))}

        {todoInCreation && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={todoInCreation}
              loading={loading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
