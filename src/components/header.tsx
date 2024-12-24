import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ChangeEvent, FormEvent } from 'react';

type Props = {
  filteredTodoList: Todo[];
  submitTodo: (e: FormEvent<Element>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  loader: boolean;
};

export const Header: React.FC<Props> = ({
  filteredTodoList,
  submitTodo,
  inputRef,
  title,
  handleChangeInput,
  loader,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active:
            filteredTodoList.length > 0 &&
            filteredTodoList.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={submitTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeInput}
          disabled={loader}
          autoFocus
        />
      </form>
    </header>
  );
};
