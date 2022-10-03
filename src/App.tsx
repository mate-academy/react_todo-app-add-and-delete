/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './TodoList/Todolist';
import { Footer } from './Footer/Footer';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setfilterType] = useState('all');
  const [error, setError] = useState<string | null>('');
  const [title, setTitle] = useState('');
  // const [todoId, setTodoId] = useState(0);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
        return todo;
      default:
        return 0;
    }
  });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  userId = 0;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => (setError('Unable to load todo from server')));
  }, []);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setError('Title can\'t be empty');
      setTitle('');
      return;
    }

    await createTodo(title, userId)
      .then(newTitle => {setTodos([...todos, newTitle])})
      .catch((error) => {
        console.log(error);
        setError('Unable to add a todo');
      });

    setTitle('')
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
    ) => {
    setTitle(event.target.value)
  }

  const handleClickDelete = (todoId: number) => {
    deleteTodo(todoId)
    .then(()=> {setTodos(currTodos => currTodos
      .filter(todo => todo.id !== todoId))})
      .catch((error) => {
        console.log(error);
        setError('Unable to delete a todo');
      });
  }


  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
          onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChange}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          handleClickDelete={handleClickDelete}
        />

        <Footer
          filterType={filterType}
          setfilterType={setfilterType}
          filteredTodos={filteredTodos}
          todos={todos}
          handleClickDelete={handleClickDelete}
        />
      </div>

      {error &&
        <ErrorNotification
        error={error}
        setError={setError}
      />}
    </div>
  );
};
