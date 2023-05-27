/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { updateTodo, postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  setTodoList:(todo: Todo[]) => void,
  todoList: Todo[],
  setError:(text: string) => void,
  setProcessings:(id: number | null) => void,
};

export const Header:React.FC<Props> = ({
  setTodoList,
  todoList,
  setError,
  setProcessings,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [allActiveButton, setAllActiveButton] = useState(false);

  useEffect(() => setAllActiveButton(
    todoList.some(item => !item.completed),
  ));

  function onAddTodo(key: string, id: number, todoTitle: string) {
    if (key === 'Enter') {
      if (!inputValue) {
        setError(ErrorMessage.Title);

        return;
      }

      const newTodo = {
        title: inputValue,
        completed: false,
        userId: 10514,
        id: 0,
      };

      setTodoList([...todoList, newTodo]);

      postTodo(id, todoTitle)
        .then(response => {
          setTodoList(todoList.filter(todo => todo.id));
          setTodoList([...todoList, response]);
          setInputValue('');
        })
        .catch(() => {
          setTodoList(todoList.filter(todo => todo.id));
          setError(ErrorMessage.Post);
        });
    }
  }

  function onAllCompleated() {
    todoList.forEach(todo => {
      if (todo.completed !== allActiveButton) {
        setProcessings(todo.id);

        updateTodo(todo.id, { ...todo, completed: allActiveButton })
          .then(() => setTodoList(todoList.map(item => {
            return { ...item, completed: allActiveButton };
          })))
          .finally(() => setProcessings(null));
      }
    });
  }

  return (
    <header className="todoapp__header">
      {todoList.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all',
            { active: !allActiveButton })}
          onClick={onAllCompleated}
        />
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => onAddTodo(e.key, 10514, inputValue)}
        />
      </form>
    </header>
  );
};
