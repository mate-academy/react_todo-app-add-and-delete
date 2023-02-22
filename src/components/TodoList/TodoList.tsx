import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../Todo';
import { Todo } from '../../types/Todo';
import { UserIdContext } from '../../utils/context';
import { TodoVariant } from '../../types/TodoVariant';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  creatingTodoTitle: string;
  isClearCompleted: boolean;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  DeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  creatingTodoTitle,
  isClearCompleted,
  DeleteTodo,
  showError,
  hideError,
}) => {
  const userId = useContext(UserIdContext);

  const creatingTodo: TodoVariant = !creatingTodoTitle
    ? null
    : {
      id: 0,
      userId,
      title: creatingTodoTitle,
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
