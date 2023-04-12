import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export const TodoInfo = React.memo(({
  todosFromServer,
  askTodos,
  setErrorMessage,
  temporaryTodos,
}: {
  todosFromServer: Todo[] | undefined;
  askTodos: (url: string, callback?: () => void) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  temporaryTodos: Todo[] | undefined;
}) => {
  return (
    <div>
      <TransitionGroup>
        {todosFromServer?.map((todo: Todo) => {
          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                askTodos={askTodos}
                setErrorMessage={setErrorMessage}
              />
            </CSSTransition>
          );
        })}

        {
          temporaryTodos?.map((todo: Todo) => {
            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  isFirstLoading
                  todo={todo}
                  askTodos={askTodos}
                  setErrorMessage={setErrorMessage}
                />
              </CSSTransition>
            );
          })
        }
      </TransitionGroup>
    </div>

  );
});
