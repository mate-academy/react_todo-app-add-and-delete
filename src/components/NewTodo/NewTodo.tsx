import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { postTodo } from '../../api/todos';
import { TodosContext } from '../TodosContextProvider/TodosContextProvider';
import { USER_ID } from '../../utils/UserId';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';

type Props = {
  setTempTodo: (todo: Todo | null) => void,
  tempTodo: Todo | null,
};

export const NewTodo: React.FC<Props> = ({
  setTempTodo, tempTodo,
}) => {
  const { onNewError } = useContext(ErrorContext);
  const { setTodos, todos } = useContext(TodosContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [todos, tempTodo]);

  const handleAddingTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      onNewError('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    postTodo(newTodo)
      .then((response) => {
        setNewTodoTitle('');
        setTodos((prevTodos) => [...prevTodos, response]);
      })
      .catch(() => onNewError('Unable to add a todo'))
      .finally(() => setTempTodo(null));

    setTempTodo({
      ...newTodo,
      id: 0,
    });
  };

  return (
    <form onSubmit={handleAddingTodo}>
      <input
        data-cy="NewTodoField"
        ref={titleInput}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
        disabled={!!tempTodo}
      />
    </form>
  );
};
