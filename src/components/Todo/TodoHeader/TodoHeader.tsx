import { FC } from 'react';
import { Todo } from '../../../types/Todo';
import { isAllTodosCompleted } from '../../../utils/todos/getTodos';
import { TodoForm } from '../TodoForm/TodoForm';

interface TodoHeaderProps {
  todos: Todo[];
}

export const TodoHeader: FC<TodoHeaderProps> = ({ todos }) => {
  return (
    <header className="todoapp__header">
      {isAllTodosCompleted(todos) && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <TodoForm />
    </header>
  );
};
