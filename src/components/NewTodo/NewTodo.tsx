import {
  FC,
  LegacyRef,
  memo,
  useState,
} from 'react';

interface Props {
  newTodoField: LegacyRef<HTMLInputElement>;
  submitNewTodo: (str: string) => void;
  isAdding: boolean;
}

export const NewTodo: FC<Props> = memo(({
  newTodoField,
  submitNewTodo,
  isAdding,
}) => {
  const [title, setTitle] = useState('');

  const onSumbit = () => {
    submitNewTodo(title);
    setTitle('');
  };

  return (
    <form onSubmit={event => {
      event.preventDefault();
      onSumbit();
    }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
});
