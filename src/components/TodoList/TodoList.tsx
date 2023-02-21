import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { UserIdContext } from '../../utils/context';
import { PossibleError } from '../../types/PossibleError';
import { PossibleTodo } from '../../types/PossibleTodo';

type Props = {
  todos: Todo[];
  tempTodoTitle: string;
  deleteTodo: (todoId: number) => void;
  showError: (possibleError: PossibleError) => void;
  hideError: () => void;
  isClearCompleted: boolean;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodoTitle,
  deleteTodo,
  showError,
  hideError,
  isClearCompleted,
}) => {
  const userId = useContext(UserIdContext);

  const tempTodo: PossibleTodo = !tempTodoTitle
    ? null
    : {
      id: 0,
      userId,
      title: tempTodoTitle,
      completed: false,
    };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          showError={showError}
          hideError={hideError}
          deleteTodo={deleteTodo}
          isLoading={todo.completed && isClearCompleted}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={0}
          showError={() => {}}
          hideError={() => {}}
          deleteTodo={() => {}}
          isLoading
        />
      )}
    </section>
  );
});
