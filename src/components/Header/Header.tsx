import classNames from 'classnames';
import type { HeaderType } from '../../types/HeaderType';
import { USER_ID } from '../../api/todos';

export const Header = ({
  onVal,
  todosItemsList,
  onAllItems,
  load,
  inputFocus,
  onChangeVal,
  onTodoList,
  onAdd,
  onError,
  onTempTodo,
}: HeaderType) => {
  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onVal.trim() === '') {
      onError('Title should not be empty');
    } else {
      const newTempTodo = {
        id: 0,
        title: onVal,
        completed: false,
        userId: USER_ID,
      };

      onTempTodo(newTempTodo);
      await onAdd({
        completed: false,
        title: onVal.trim(),
        userId: USER_ID,
      });
      onTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: onAllItems,
        })}
        data-cy="ToggleAllButton"
        onClick={() => {
          const selected = !onAllItems;

          onTodoList(
            todosItemsList.map(item => ({
              ...item,
              completed: selected,
            })),
          );
        }}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={async e => {
          await onHandleSubmit(e);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputFocus}
          className="todoapp__new-todo"
          disabled={load}
          placeholder="What needs to be done?"
          value={onVal}
          onChange={e => {
            onChangeVal(e.target.value);
          }}
        />
      </form>
    </header>
  );
};
