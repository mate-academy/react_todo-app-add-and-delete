/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { deleteTodo, getTodos, patchTodo, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './Footer';
import { Header } from './Header';
import { Status } from './enums/status';
import { Title } from './Title';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [isEdited, setIsEdited] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [editedTitle, setEditedTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [stat, setStat] = useState(Status.all);
  const [visibleErr, setVisibleErr] = useState(false);

  const filteredTodos = (tod: Todo[], type: Status) => {
    switch (type) {
      case Status.active:
        return tod.filter(todo => !todo.completed);
      case Status.completed:
        return tod.filter(todo => todo.completed);

      default:
        return tod;
    }
  };

  const visibleTodos = filteredTodos(todos, stat);
  const editSelectedInput = useRef<HTMLInputElement>(null);
  const selectInputTitle = useRef<HTMLInputElement>(null);
  const isAnyCompleted = todos.some(todo => todo.completed);

  const resetErr = () =>
    setTimeout(() => {
      setVisibleErr(false);
      setErrMessage('');
    }, 3000);

  useEffect(() => {
    if (isEdited && editSelectedInput.current) {
      editSelectedInput.current.focus();
    }
  }, [isEdited]);

  useEffect(() => {
    const loadTodos = async () => {
      getTodos()
        .then(setTodos)
        .catch(() => {
          setVisibleErr(true);
          setErrMessage('Unable to load todos');
          resetErr();
        });
    };

    loadTodos();
  }, []);

  const updateTodo = async (updatedTodo: Todo, option: keyof Todo) => {
    try {
      setIsLoading(updatedTodo.id);
      const todoToUpdate = todos.find(tod => tod.id === updatedTodo.id);

      let newTodo: Todo = {
        id: 0,
        userId: 0,
        title: '',
        completed: false,
      };

      if (option === 'completed' && todoToUpdate) {
        newTodo = { ...todoToUpdate, completed: !updatedTodo.completed };
      }

      if (option === 'title' && todoToUpdate) {
        newTodo = { ...todoToUpdate, title: editedTitle };
      }

      await patchTodo(newTodo);

      getTodos().then(setTodos);

      // setTodos(prevTodos => {
      //   return prevTodos.map(todo => {
      //     if (todo.id === updatedTodo.id) {
      //       return { ...todo, ...newTodo };
      //     }

      //     return todo;
      //   });
      // });
    } catch {
      setVisibleErr(true);
      setErrMessage('Unable to update a todo');
      resetErr();
    } finally {
      setIsLoading(null);
    }
  };

  const addTodo = async () => {
    const trimedTitle = newTitle.trim();

    if (newTitle === '' || trimedTitle === '') {
      setVisibleErr(true);
      setErrMessage('Title should not be empty');
      resetErr();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: 472,
      title: trimedTitle,
      completed: false,
    };

    try {
      setIsLoading(0);
      await postTodo(newTodo);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      await getTodos().then(setTodos);
    } catch (error) {
      setVisibleErr(true);
      setErrMessage('Unable to add a todo');
      resetErr();
    } finally {
      setIsLoading(null);
      setNewTitle('');
    }
  };

  const removeTodo = async (todoToRmove: Todo) => {
    try {
      setIsLoading(todoToRmove.id);

      await deleteTodo(todoToRmove.id);

      getTodos().then(setTodos);
      // setTodos(prevTodos => {
      //   return prevTodos.filter(todo => todo.id !== todoToRmove.id);
      // });
    } catch {
      setVisibleErr(true);
      setErrMessage('Unable to delete a todo');
      resetErr();
    } finally {
      setIsLoading(null);
    }
  };

  const handleEditedTitle = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    event.preventDefault();

    if (event.key === 'Enter') {
      updateTodo(todo, 'title');
      setIsEdited(null);
    }
  };

  const handleRemoveButton = (
    todo: Todo,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    removeTodo(todo);
  };

  const handleSubmit = () => {
    const trimedTitle = newTitle.trim();

    if (newTitle === '' || trimedTitle === '') {
      setVisibleErr(true);
      setErrMessage('Title should not be empty');
      resetErr();

      return;
    }

    addTodo();

    if (selectInputTitle.current) {
      selectInputTitle.current.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          todos={todos}
          handleSubmit={handleSubmit}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={cn('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => updateTodo(todo, 'completed')}
                />
              </label>

              {!isEdited && (
                <Title
                  handleRemoveButton={handleRemoveButton}
                  todo={todo}
                  setIsEdited={setIsEdited}
                />
              )}

              {isEdited === todo.id && (
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder={todo.title}
                    value={editedTitle}
                    onChange={event => setEditedTitle(event.target.value)}
                    onKeyUp={event => handleEditedTitle(event, todo)}
                    onBlur={() => setIsEdited(null)}
                    ref={editSelectedInput}
                  />
                </form>
              )}

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': isLoading === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <Footer
            stat={stat}
            todos={todos}
            isAnyCompleted={isAnyCompleted}
            setStat={setStat}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !visibleErr },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setVisibleErr(false)}
        />
        {errMessage}
      </div>
    </div>
  );
};
