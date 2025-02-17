import { useEffect, useRef } from 'react';
import { useTodosContext } from '../../context/TodosContext';

type AddTodoFormProps = {
  title: string;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
  setTitle: (title: string) => void;
};

export const AddTodoForm: React.FunctionComponent<AddTodoFormProps> = ({
  submit,
  setTitle,
  title,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { todos, loadingIds, errorMessage } = useTodosContext();

  const isInputActive = loadingIds.length > 0;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  return (
    <form onSubmit={submit}>
      <input
        ref={inputRef}
        disabled={isInputActive}
        data-cy="NewTodoField"
        type="text"
        value={title}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={e => {
          setTitle(e.target.value);
        }}
      />
    </form>
  );
};
