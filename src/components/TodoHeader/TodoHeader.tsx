import { useState } from 'react';
import cn from 'classnames';
import { getCompletedTodos } from '../../services/todo';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[],
  setIsError: (status: boolean) => void,
  setErrorMessage: (message: ErrorMessage) => void
  loadingTodoIds: number[],
  setLoadingTodoIds: (ids: number[]) => void,
  createTodo: (todoTitle: string) => void,

};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setIsError,
  setErrorMessage,
  createTodo,
}) => {
  const [title, setTitle] = useState('');
  const isAllCompleted = getCompletedTodos(todos).length === todos.length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = title.trim();

    if (!trimedTitle) {
      setErrorMessage('Title can\'t be empty');
      setIsError(true);

      return;
    }

    createTodo(trimedTitle);
    setTitle('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => (
    setTitle(event.target.value)
  );

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
      >
        ❯
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
