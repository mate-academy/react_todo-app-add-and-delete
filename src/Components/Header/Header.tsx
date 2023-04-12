import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/UserID';

type Props = {
  todos: Todo[];
  setTodoList: (todos: Todo[]) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setTitleTodo: (value: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  setTempTodo: (value: Todo | null) => void;
  activeInput: boolean;
  setActiveInput: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodoList,
  title,
  handleChangeTitle,
  setTitleTodo,
  setErrorMessage,
  setTempTodo,
  activeInput,
  setActiveInput,
}) => {
  const handleAddNewTodo = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Todo must have a title');
    }

    if (title) {
      try {
        const newTodo = {
          userId: USER_ID,
          title,
          completed: false,
        };

        setActiveInput(false);
        setTempTodo({ ...newTodo, id: 0 });

        await addTodo(newTodo)
          .then((response) => setTodoList([...todos, response]));

        setTitleTodo('');
      } catch {
        setErrorMessage('Unable to add a todo');
      } finally {
        setActiveInput(true);
        setTempTodo(null);
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="button"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleAddNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={!activeInput}
        />
      </form>
    </header>
  );
};
