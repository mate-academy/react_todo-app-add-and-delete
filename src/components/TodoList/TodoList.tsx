import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoItem } from '../TodoItem';
import { UserIdContext } from '../../contexts/UserIdContext';

import { ErrorType } from '../../enums/ErrorType';
import { Todo } from '../../types/Todo';
import { OptionalTodo } from '../../types/OptionalTodo';

type Props = {
  todos: Todo[];
  tempTodoTitle: string;
  isClearCompleted: boolean;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodoTitle,
    isClearCompleted,
    onDeleteTodo,
    showError,
    hideError,
  }) => {
    const userId = useContext(UserIdContext);

    const tempTodo: OptionalTodo = !tempTodoTitle
      ? null
      : {
        id: 0,
        userId,
        title: tempTodoTitle,
        completed: false,
      };

    return (
      <section className="todoapp__main">
        <TransitionGroup>
          {todos.map((todo) => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                showError={showError}
                hideError={hideError}
                onDeleteTodo={onDeleteTodo}
                isLoading={todo.completed && isClearCompleted}
              />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={tempTodo}
                showError={() => {}}
                hideError={() => {}}
                onDeleteTodo={() => {}}
                isLoading
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
