import { useEffect, useRef, useState } from 'react';
import { useTodos } from '../../context/TodosContext';
import { USER_ID, postTodos } from '../../api/todos';
import { Todo, TodoWithoutId } from '../../types/Todo';

export const TodosForm: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const {
    handleSetError,
    setTempTodo,
    addTodo,
    isLoading,
    dispatch,
    isDeletingAllCompleted,
  } = useTodos();
  const isEmptyTodo = !title.trim().length;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isDeletingAllCompleted]);

  const handleOnSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isEmptyTodo) {
      handleSetError('Title should not be empty');
    } else {
      const newTodo: TodoWithoutId = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      const tempTodo: Todo = {
        id: 0,
        ...newTodo,
      };

      setTempTodo(tempTodo);
      dispatch({ type: 'loading', payload: true });

      try {
        const response = await postTodos(newTodo);

        addTodo(response);
        setTitle('');
      } catch {
        handleSetError('Unable to add a todo');
      } finally {
        setTempTodo(null);
        dispatch({ type: 'loading', payload: false });
      }
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        ref={inputRef}
        disabled={isLoading}
        value={title}
        onChange={event => setTitle(event.target.value)}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
