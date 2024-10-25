import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

interface Props {
  todos: Todo[];
  onAddTodo: (todo: Todo) => Promise<void>;
  errorMessage: (error: string) => void;
  onTempTodo: (todo: Todo | null) => void;
  focusInput: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isErrorHidden: (boolean: boolean) => void;
}

export const TodoForm: React.FC<Props> = ({
  todos,
  onAddTodo,
  errorMessage,
  onTempTodo,
  focusInput,
  inputRef,
  isErrorHidden,
}) => {
  const [todo, setTodo] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const handleInput = (evnt: React.ChangeEvent<HTMLInputElement>) => {
    isErrorHidden(true);
    setTodo(evnt.target.value);
    setDisableInput(false);

    return;
  };

  const resetForm = () => {
    setTodo('');
  };

  const handleSubmit = async (evnt: React.FormEvent<HTMLFormElement>) => {
    evnt.preventDefault();
    setDisableInput(true);

    if (!todo.trim()) {
      isErrorHidden(false);
      errorMessage('Title should not be empty');
      setDisableInput(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todo.trim(),
      completed: false,
    };

    onTempTodo(newTodo);

    try {
      await onAddTodo(newTodo);
      setDisableInput(false);
      resetForm();
      onTempTodo(null);
      focusInput();
    } catch (error) {
      setDisableInput(false);
      onTempTodo(null);
      isErrorHidden(false);
      errorMessage('Unable to add a todo');
    }
  };

  useEffect(() => {
    if (!disableInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disableInput, inputRef]);

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={disableInput}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={handleInput}
        />
      </form>
    </>
  );
};
