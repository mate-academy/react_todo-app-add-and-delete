import {
  ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { addTodo, lastTodoId } from '../../../api/todos';
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
  const [lastId, setLastId] = useState<number>(0);
  const [activeTodoField, setActiveTodoField] = useState(true);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const found = todos.find(stateTodo => stateTodo.id === 0);

    const foundIndex = todos.findIndex(stateTodo => stateTodo.id === 0);

    if (found !== undefined) {
      found.id = lastId + 1;

      const newTodos = todos.map((item, index) => {
        if (index === foundIndex) {
          return found;
        }

        return item;
      });

      setTodos(newTodos);
      handleFilter(filterState, newTodos);
    }
  }, [lastId]);

  const addTodoToTheServer = async () => {
    try {
      if (userId) {
        const last = await lastTodoId();

        // console.log(last);

        const newTodo = {
          id: last + 1,
          userId,
          title: todoField,
          completed: false,

        };

        await addTodo(userId, newTodo);
        setLastId(last);
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
