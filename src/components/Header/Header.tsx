import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  userId: number,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
};

export const Header: React.FC<Props> = ({
  setTempTodo,
  tempTodo,
  userId,
  setErrorMessage,
  setTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');

  const handleAddingTodo = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!todoTitle.trim().length) {
        setErrorMessage(ErrorMessages.ONEMPTYADD);

        return;
      }

      setErrorMessage(ErrorMessages.NOERROR);
      setTempTodo({
        id: 0,
        userId,
        title: todoTitle,
        completed: false,
      });

      setTodoTitle('');

      const newTodo = await createTodo(todoTitle, userId);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return [...prevTodos, newTodo];
      });

      setTempTodo(null);
    } catch (error) {
      setErrorMessage(ErrorMessages.ONADD);
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Add todo"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddingTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
