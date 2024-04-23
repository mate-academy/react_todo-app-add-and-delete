import { Ref, useEffect, useState } from 'react';

type Props = {
  handleAddTodo: (title: string) => void;
  addTodoTitle: string | null;
  newTodoInput: Ref<HTMLInputElement>;
  isNewTodoLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  handleAddTodo,
  addTodoTitle,
  newTodoInput,
  isNewTodoLoading,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  // const [hasNewTodoLoaded, setHasNewTodoLoaded] = useState(false);

  useEffect(() => {
    if (addTodoTitle === null) {
      setTodoTitle('');
    }
  }, [addTodoTitle]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={event => {
          event.preventDefault();

          // Set the title of the new todo to the App component
          handleAddTodo(todoTitle.trim());

          // When addTodoTitle is null again -> setTodoTitle('')

          // setTodoTitle('');
        }}
      >
        {/* Keep the input value until the new todo hasn't loaded*/}
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isNewTodoLoading}
          ref={newTodoInput}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
