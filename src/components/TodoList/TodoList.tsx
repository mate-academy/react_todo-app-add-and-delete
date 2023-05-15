import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../types/ConstantTypes';

type Props = {
  todos: Todo[];
  query: string;
  isClearCompleted: boolean;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  DeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  query,
  isClearCompleted,
  DeleteTodo,
  showError,
  hideError,
}) => {
  const creatingTodo: Todo | null = !query
    ? null
    : {
      id: 0,
      USER_ID,
      title: query,
      completed: false,
    };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              showError={showError}
              hideError={hideError}
              DeleteTodo={DeleteTodo}
              isLoading={todo.completed && isClearCompleted}
            />
          </CSSTransition>
        ))}

        {creatingTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={creatingTodo}
              showError={() => {}}
              hideError={() => {}}
              DeleteTodo={() => {}}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
