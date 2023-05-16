import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todosFromServer: Todo[];
  onDelete: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todosFromServer,
  onDelete,
  tempTodo,
}) => {
  const createTodo = tempTodo?.id === 0;

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todosFromServer.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}

        {createTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              tempTodoId={tempTodo.id}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
