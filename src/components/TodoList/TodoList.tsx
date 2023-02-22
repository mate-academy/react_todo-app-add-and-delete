import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  creatingTodo: Todo | null;
  onRemoveTodo: (todo: Todo) => void;
  onToogleUpdateTodo: (todo: Todo) => void;
  onHandleUpdate: (todo: Todo) => void;
  todosLoadingState: Todo[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  creatingTodo,
  onRemoveTodo,
  onToogleUpdateTodo,
  onHandleUpdate,
  todosLoadingState,
}) => {
  return (
    <ul className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              key={todo.id}
              todosLoadingState={todosLoadingState}
              onRemoveTodo={onRemoveTodo}
              onToogleUpdateTodo={onToogleUpdateTodo}
              onHandleUpdate={onHandleUpdate}
            />
          </CSSTransition>
        ))}

        {creatingTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={creatingTodo}
              todosLoadingState={todosLoadingState}
              onRemoveTodo={() => { }}
              onToogleUpdateTodo={onToogleUpdateTodo}
              onHandleUpdate={onHandleUpdate}
            />
          </CSSTransition>

        )}
      </TransitionGroup>
    </ul>
  );
});
