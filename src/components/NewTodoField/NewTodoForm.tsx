import { useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  onAdd: (title: string) => void,
  isAdding: boolean,
};

export const NewTodoForm:React.FC<Props> = ({
  newTodoField,
  onAdd,
  isAdding,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAdd(title);
    setTitle('');
  };

  return (
    <form onSubmit={(e) => {
      handleSubmit(e);
    }}>
      <input
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        value={title}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
    </form>
  );
};
