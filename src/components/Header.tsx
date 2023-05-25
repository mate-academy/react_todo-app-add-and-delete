import { ErrorType } from '../utils/ErrorType';
import { Todo } from '../types/Todo';

type Props = {
  newTodo: string,
  setNewTodo: (todo: string) => void,
  sendTodo: (todoData: Todo) => void,
  isAnyActiveTodo: boolean,
  errorNotification: (value: ErrorType) => void,
  isInputDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  sendTodo,
  isAnyActiveTodo,
  errorNotification,
  isInputDisabled,
}) => {
  const handleSubmitForm = () => {
    if (newTodo.trim() === '') {
      errorNotification(ErrorType.Empty);

      return;
    }

    const tempTodo: Todo = {
      title: newTodo,
      id: 0,
      userId: 10360,
      completed: false,
    };

    sendTodo(tempTodo);
    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {isAnyActiveTodo && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmitForm();
        }}
      >
        <input
          disabled={isInputDisabled}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => {
            setNewTodo(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
