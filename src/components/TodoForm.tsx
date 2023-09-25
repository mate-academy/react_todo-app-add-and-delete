/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';

interface Form {
  todoTitle: string,
  onTodoCreate: (newTodoTitle: string) => void,
  createTodo: () => Promise<unknown>,
}

export const TodoForm: React.FC<Form> = ({
  todoTitle,
  onTodoCreate,
  createTodo,
}) => {
  const [processing, setProcessing] = useState(false);

  const resetTitleField = () => {
    onTodoCreate('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    await createTodo()
      .finally(() => setProcessing(false));

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
        onChange={(event) => onTodoCreate(event.target.value)}
      />
    </form>
  );
};
