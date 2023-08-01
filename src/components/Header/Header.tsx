/* eslint-disable no-console */
import { FormEvent } from 'react';
import cn from 'classnames';
import { useAppContext } from '../Context/AppContext';
import { client } from '../../utils/fetchClient';
import { getTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  setTempTodo: (val: Todo | null) => void,
};

export const Header = ({ setTempTodo }: Props) => {
  const {
    userId,
    todos,
    setTodos,
    todoTitle,
    setTodoTitle,
    setErrorType,
    setProcessing,
  } = useAppContext();
  let disableInput = false;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    disableInput = true;

    if (todoTitle.length === 0) {
      setErrorType(ErrorTypes.title);
    } else {
      const newTodo = {
        title: todoTitle,
        userId,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      client.post('/todos/', newTodo)
        .then(() => {
          getTodos(userId)
            .then((data) => {
              setTempTodo(null);
              setTodos(data);
              setTodoTitle('');
              disableInput = false;
            })
            .catch(() => {
              setErrorType(ErrorTypes.load);
            })
            .finally(() => {
            });
        })
        .catch(() => {
          setErrorType(ErrorTypes.add);
        });
    }
  };

  const handleToggleAll = () => {
    const arrOfPromises: Promise<unknown>[] = [];
    const activeTodosId = todos
      .filter(todo => !todo.completed)
      .map(todo => todo.id);

    if (activeTodosId.length > 0) {
      activeTodosId.forEach((id) => {
        setProcessing((currentState) => [...currentState, id]);
        arrOfPromises.push(
          client.patch(`/todos/${id}`, { completed: true })
            .catch(() => {
              setErrorType(ErrorTypes.update);
            }),
        );
      });
    } else {
      todos.forEach((item) => {
        setProcessing((currentState) => [...currentState, item.id]);
        arrOfPromises.push(
          client.patch(`/todos/${item.id}`, { completed: false })
            .catch(() => {
              setErrorType(ErrorTypes.update);
            }),
        );
      });
    }

    Promise.all(arrOfPromises)
      .then(() => {
        getTodos(userId)
          .then(setTodos)
          .catch(() => {
            setErrorType(ErrorTypes.load);
          })
          .finally(() => {
            setProcessing([]);
          });
      })
      .catch(() => {
        setProcessing([]);
      });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todoTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
