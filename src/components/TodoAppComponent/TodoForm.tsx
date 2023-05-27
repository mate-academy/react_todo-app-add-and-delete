import { useTodosContext } from '../../utils/TodosContext';

interface PropsNewTodo {
  value: string,
  setValue(val: string): void;
}
export const NewTodo = ({ value, setValue }: PropsNewTodo) => {
  const { createNewTodo, tempTodo } = useTodosContext();

  return (
    <form
      onSubmit={createNewTodo}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={tempTodo !== null}
      />
    </form>
  );
};
