import { useContext, useState } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import { addTodo } from '../api/todos';

export const NewTodoField: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { isUpdating } = useContext(StatesContext);
  const [title, setTitle] = useState('');
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'startUpdate' });
        if (!title.trim()) {
          dispatch({
            type: 'showError',
            payload: 'Title should not be empty',
          });
          dispatch({ type: 'stopUpdate' });
        } else {
          addTodo({ userId: 962, title: title.trim(), completed: false })
            .then(newTodo => dispatch({ type: 'addTodo', payload: newTodo }))
            .catch(() => {
              dispatch({ type: 'showError', payload: 'Unable to add a todo' });
            })
            .finally(() => {
              dispatch({ type: 'stopUpdate' });
              setTitle('');
            });
        }
      }}
    >
      <input
        autoFocus
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleOnChange}
        disabled={isUpdating}
      />
    </form>
  );
};
