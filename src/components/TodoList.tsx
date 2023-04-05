import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { UserIdContext } from '../context/UserIdConext';
import { ErrorType } from '../enums/ErrorType';
import { TodoItem } from './TodoItem';
import { OptionalTodo } from '../types/OptionalTodo';

type Props = {
  todos: Todo[];
  tempTodoTitle: string;
  isClearCompleted: boolean;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  onDeleteTodo: (todoId: number) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  tempTodoTitle,
  showError,
  hideError,
  onDeleteTodo,
  isClearCompleted,
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
};

export default TodoList;
