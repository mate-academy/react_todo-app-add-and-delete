import { useState } from 'react';

type Props = {
  todoTitle: string;
  setTodoTitle: (newtodoTitle: string) => void;
  createdNewTodo: () => Promise<unknown>;
};

export const TodoForm: React.FC<Props> = ({
  todoTitle,
  setTodoTitle,
  createdNewTodo,
}) => {
  const [processing, setProcessing] = useState(false);

  const resetTitleField = () => {
    setTodoTitle('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    await createdNewTodo();
    setProcessing(false);
    resetTitleField();
  };

  return (
    <form
      action="./todos"
      method="POST"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={processing}
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
      />
    </form>
  );
};
