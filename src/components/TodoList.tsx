import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import '../styles/transition.scss';

type Props = {
  filteredTodos: Todo[],
  onDelete?: (id: number) => void,
  loadingId: null | number[],
  newTodo: null | Todo,
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete = () => {},
  loadingId,
  newTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              loadingId={loadingId}
            />
          </CSSTransition>
        ))}

        {newTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={newTodo}
              loadingId={[0]}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
