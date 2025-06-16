import { Todo } from '../types/Todo';

type СlearCompletedBtnProps = {
  completedTodo: Todo[];
  onDeleteTodo: (todo: Todo) => void;
};

export const СlearCompletedBtn = ({
  completedTodo,
  onDeleteTodo,
}: СlearCompletedBtnProps) => {
  const hasCompletedTodo = completedTodo.length > 0;

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={() => {
        completedTodo.forEach(todo => {
          onDeleteTodo(todo);
        });
      }}
      disabled={!hasCompletedTodo}
    >
      Clear completed
    </button>
  );
};
