import { Todo } from '../../types/Todo';

type FormProps = {
  handleTitleChange: (query: string) => void,
  onSubmit: () => void,
  title: string,
  tempTodo: Todo | null,
};

export const Form: React.FC<FormProps>
  = ({
    handleTitleChange, onSubmit, title, tempTodo,
  }) => {
    const handleSubmit: React.FormEventHandler = (event) => {
      event.preventDefault();

      onSubmit();
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          onChange={(event) => handleTitleChange(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          ref={input => input && input.focus()}
          disabled={tempTodo !== null}
        />
      </form>
    );
  };
