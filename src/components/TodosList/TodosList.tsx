import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthContext } from '../Auth/AuthContext';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import '../../styles/transition.scss';

type Props = {
  onDelete: (id: number) => void,
  processings: number[],
  creating?: boolean,
  todos: Todo[],
  title: string,
};

export const TodoList: React.FC<Props> = ({
  onDelete,
  processings,
  creating,
  todos,
  title,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                isProcessed={processings.includes(todo.id)}
                onDelete={() => onDelete(todo.id)}
                // onUpdate={updateTodo}
              />
            </CSSTransition>
          ))}

          {creating && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={{
                  id: Math.random(),
                  title,
                  completed: false,
                  userId: user?.id || 0,
                }}
                onDelete={onDelete}
                isProcessed
              />
            </CSSTransition>
          )}
        </TransitionGroup>

      </ul>
    </section>
  );
};
