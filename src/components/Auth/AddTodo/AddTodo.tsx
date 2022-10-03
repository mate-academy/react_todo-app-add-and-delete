import {
  ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { addTodo, getTodos } from '../../../api/todos';
import { Filter } from '../../../context/TodoContext';
import { Todo } from '../../../types/Todo';

type Props = {
  userId?: number | undefined,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  filterState: Filter,
  handleFilter: (filterStatus: Filter, data: Todo[]) => void,
  todos: Todo[],
  setLoadError: (value: boolean) => void,
  setErrorMessage: (value: string) => void,
};

export const AddTodo: React.FC<Props> = ({
  userId,
  setTodos,
  filterState,
  handleFilter,
  todos,
  setLoadError,
  setErrorMessage,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoField, setTodoField] = useState('');
  const [tempTodoCount, setTempTodoCount] = useState<number>(0);
  const [activeTodoField, setActiveTodoField] = useState(true);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (userId) {
          const todoData = await getTodos(userId);

          setTodos(todoData);
          handleFilter(filterState, todoData);
        }
      } catch (_) {
        setLoadError(true);
        setErrorMessage('Unable to load todos from server');
      }
    };

    loadTodos();
  }, [tempTodoCount]);

  useEffect(() => {
    if (newTodoField.current && activeTodoField) {
      newTodoField.current.focus();
    }
  }, [activeTodoField]);

  const addTodoToTheServer = async () => {
    try {
      if (userId) {
        const last = tempTodoCount + 1;

        const newTodo = {
          userId,
          title: todoField,
          completed: false,

        };

        await addTodo(userId, newTodo);
        setTempTodoCount(last);
      }
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to add new todo to the server');
      handleFilter(filterState, todos);
      setTodos(todos);
    } finally {
      setTodoField('');
      setActiveTodoField(true);
    }
  };

  const addTodoToTheList = () => {
    if (userId) {
      const newTodo = {
        id: 0,
        userId,
        title: todoField,
        completed: false,

      };

      setTodos([...todos, newTodo]);
      handleFilter(filterState, [...todos, newTodo]);
    }
  };

  const handleNewTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoField.trim() !== '') {
      setActiveTodoField(false);
      addTodoToTheList();
      addTodoToTheServer();
    } else {
      setErrorMessage('Empty title is not valid');
      setLoadError(true);
    }
  };

  const handleInputField = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoField(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Add user"
      />

      <form onSubmit={handleNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={todoField}
          onChange={handleInputField}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!activeTodoField}
        />
      </form>
    </header>
  );
};
