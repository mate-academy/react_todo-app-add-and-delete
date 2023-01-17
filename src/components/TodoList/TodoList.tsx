import {
  FC, memo, Fragment,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoErrors } from '../../types/ErrorMessages';
import { removeTodo, updateTodoStatus } from '../../api/todos';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  visibleTodos: Todo[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoErrors>>,
}

export const TodoList: FC<Props> = memo(({
  visibleTodos,
  setIsLoading,
  setErrorMessage,
}) => {
  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const todoId = Number(event.currentTarget.value);

    try {
      await removeTodo(todoId);
      setIsLoading(true);
    } catch (error) {
      setErrorMessage(TodoErrors.onDelete);
    }
  };

  const handleComplete = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const userId = Number(event.target.value);
    const isChecked = event.target.checked;

    try {
      await updateTodoStatus(userId, isChecked);
      setIsLoading(true);
    } catch (error) {
      setErrorMessage(TodoErrors.onUpdate);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <Fragment key={todo.id}>
            <TodoItem
              todo={todo}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          </Fragment>
        );
      })}
    </section>
  );
});
