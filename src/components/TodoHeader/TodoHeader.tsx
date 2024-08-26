import { FormEvent, useState } from 'react';
// import { USER_ID } from '../../api/todos';
// import { Todo } from '../../types/Todo';

type Props = {
  // createTodo: (obj: Omit<Todo, 'id'>) => void;
};

export const TodoHeader: React.FC<Props> = () => {
  const [titleTodo, setTitleTodo] = useState<string>('');

  const handleFormInput = (event: FormEvent<HTMLInputElement>) => {
    setTitleTodo(event.currentTarget.value);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    // createTodo({ userId: USER_ID, title: titleTodo, completed: false });
    setTitleTodo('');
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={titleTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleFormInput}
        />
      </form>
    </header>
  );
};
