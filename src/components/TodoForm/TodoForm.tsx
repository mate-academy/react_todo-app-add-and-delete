import { FormEventHandler, useRef } from 'react';

type TodoFormProps = {
  addTodo: (title: string) => void;
  loading: boolean;
};

export const TodoForm = ({ addTodo, loading }: TodoFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (inputRef.current) {
      const { value } = inputRef.current;

      addTodo(value);
      inputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={loading}
        ref={inputRef}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
