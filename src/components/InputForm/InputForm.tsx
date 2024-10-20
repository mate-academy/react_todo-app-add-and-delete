import {
  Dispatch,
  FC,
  FormEventHandler,
  MutableRefObject,
  SetStateAction,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  tempTodo: Todo | null;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
};

export const InputForm: FC<Props> = ({
  handleSubmit,
  inputRef,
  tempTodo,
  inputValue,
  setInputValue,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={!!tempTodo}
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
      />
    </form>
  );
};
