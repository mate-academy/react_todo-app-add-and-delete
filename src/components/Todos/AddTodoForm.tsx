import {
  memo,
  useRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodosContext } from './TodosContext';

const AddTodoForm = memo(() => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const { setTodos, setErrors } = useContext(TodosContext);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodoField.current && user) {
      setIsAdding(true);
      setTodos(prev => [...prev, {
        id: 0,
        title: '',
        completed: false,
        userId: 0,
      }]);
      if (!newTodoField.current.value) {
        setErrors(prev => [
          "Title can't be empty",
          ...prev,
        ]);
        setIsAdding(false);

        return;
      }

      postTodo(newTodoField.current.value, user.id)
        .then(res => {
          setTodos(prev => [...prev.filter(td => td.id !== 0), res as Todo]);
          if (newTodoField.current) {
            newTodoField.current.value = '';
          }
        })
        .catch(() => {
          setErrors(prev => [
            'Unable to delete a todo',
            ...prev,
          ]);
          setTodos(prev => prev.filter(td => td.id !== 0));
        })
        .finally(() => {
          setIsAdding(false);
        });
    }
  };

  return (
    <form onSubmit={e => save(e)}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        aria-label="Add todo item"
        disabled={isAdding}
      />
    </form>
  );
});

export default AddTodoForm;
