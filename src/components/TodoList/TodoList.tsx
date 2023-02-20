import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { UserContext } from '../../UserContext';
import { ErrorType } from '../../types/ErrorType';
import { OptionalTodo } from '../../types/OptionalTodo';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../Todo/Todo';

type Props = {
  todos: Todo[];
  tempTodoName: string;
  isClearCompleted: boolean;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodoName,
    isClearCompleted,
    deleteTodo,
    showError,
    hideError,
  }) => {
    const userId = useContext(UserContext);

    const tempTodo: OptionalTodo = !tempTodoName
      ? null
      : {
        id: 0,
        userId,
        title: tempTodoName,
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
              <TodoInfo
                todo={todo}
                showError={showError}
                hideError={hideError}
                deleteTodo={deleteTodo}
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
              <TodoInfo
                todo={tempTodo}
                showError={() => {}}
                hideError={() => {}}
                deleteTodo={() => {}}
                isLoading
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
