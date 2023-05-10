import { FC, useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosContext/TodosContext';

import '../../styles/cssTransition.scss';

interface Props {
  visibleTodos: Todo[]
}

export const TodoList: FC<Props> = ({ visibleTodos }) => {
  const { newTodo, todoLoading } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={500}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>

        ))}
        {newTodo && (
          <CSSTransition
            key={newTodo.id}
            timeout={500}
            classNames="temp-item"
          >
            <TodoItem
              todo={newTodo}
              todoLoading={todoLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
