import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import '../styles/transition.scss';

type Props = {
  filteredTodos: Todo[],
  onDelete?: (id: number) => void,
  loadingTodoIds: number[],
  newTodo: null | Todo,
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete = () => {},
  loadingTodoIds,
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
              loadingTodoIds={loadingTodoIds}
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
              loadingTodoIds={loadingTodoIds}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
