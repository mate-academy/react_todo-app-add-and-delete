import { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/userId';
import { addTodo } from '../../api/todos';
import { TodoContext } from '../TodoContext';
import { ErrorContext } from '../ErrorContext';

type Props = {
  onTempTodoAdd: (todo: Todo | null) => void;
  tempTodo: Todo | null;
};

export const TodoHeader: React.FC<Props> = (props) => {
  const {
    onTempTodoAdd,
    tempTodo,
  } = props;

  const { setError } = useContext(ErrorContext);
  const { setTodos } = useContext(TodoContext);
  const [title, setTitle] = useState('');

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError('Title can\'t be empty');

      return;
    }

    onTempTodoAdd({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });
  };

  useEffect(() => {
    if (tempTodo) {
      addTodo(USER_ID, tempTodo)
        .then((res) => {
          setTodos(prevState => [...prevState, res]);
          setTitle('');
        })
        .catch(() => setError('Unable to add a todo'))
        .finally(() => onTempTodoAdd(null));
    }
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="button_toggle_active"
      />

      <form
        onSubmit={handleSubmitForm}
      >
        <input
          disabled={!!tempTodo}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
