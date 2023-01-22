import {
  // prettier-ignore
  useEffect,
  useRef,
  useContext,
  FormEvent,
} from 'react';
import { useTodoContext } from '../../store/todoContext';
import { AuthContext } from '../Auth/AuthContext';
import { postTodos } from '../../api/todos';
import { ErrorMsg } from '../../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const TodoHeader = () => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const {
    // prettier-ignore
    newTodo,
    getNewTodo,
    renewTodos,
    setError,
    addTempTodo,
  } = useTodoContext();

  const user = useContext(AuthContext);

  const sendTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (newTodo && user) {
      const todoToSend = {
        userId: user.id,
        title: newTodo,
        completed: false,
      };

      addTempTodo(newTodo, user.id);

      try {
        const todo = await postTodos(todoToSend);
        // eslint-disable-next-line
        renewTodos(todo);
      } catch {
        setError(true, ErrorMsg.AddError);
      } finally {
        getNewTodo('');
        addTempTodo();
      }
    } else {
      setError(true, ErrorMsg.TitleError);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={sendTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => getNewTodo(e.target.value)}
        />
      </form>
    </header>
  );
};
