/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';

export enum ErrorMessage {
  Default = '',
  isLoadTodoError = 'Unable to load todos',
  isTitleEmpty = 'Title should not be empty',
  isUnableAddTodo = 'Unable to add a todo',
  isUnableDeleteTodo = 'Unable to delete a todo',
  isUnableUpdateTodo = 'Unable to update a todo',
}

interface InterfaceTodosContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredTodos: Todo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;

  alarm: ErrorMessage,
  setAlarm: React.Dispatch<React.SetStateAction<ErrorMessage>>;

  tempTodo: null | Todo,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isTodoChange: boolean;
  setIsTodoChange: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemoveTodo: (val: Todo) => void;

  changingItems: number[];
  setChangingItems: React.Dispatch<React.SetStateAction<number[]>>;
}

type Props = {
  children: React.ReactNode,
};

export const TodosContext = React.createContext<InterfaceTodosContext>({
  todos: [],
  setTodos: () => {},
  filteredTodos: [],
  setFilteredTodos: () => {},

  alarm: ErrorMessage.Default,
  setAlarm: () => {},

  tempTodo: null,
  setTempTodo: () => {},
  isTodoChange: false,
  setIsTodoChange: () => {},
  handleRemoveTodo: () => {},

  changingItems: [],
  setChangingItems: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState(todos);

  const [alarm, setAlarm] = useState(ErrorMessage.Default);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isTodoChange, setIsTodoChange] = useState(false);

  const [changingItems, setChangingItems] = useState<number[]>([]);

  // const handleRemoveTodo = (todoId: number) => {
  //   setIsTodoChange(true);
  //   setChangingItems(current => [...current, todoId]);
  //   removeTodo(todoId)
  //     .then(() => {
  //       setTodos(currentTodos => currentTodos
  //         .filter(({ id }) => id !== todoId));
  //         console.log(todos);
  //       setIsTodoChange(false);
  //     })
  //     .catch(() => setAlarm(ErrorMessage.isUnableDeleteTodo))
  //     .finally(() => {
  //       setFilteredTodos(todos);
  //       setIsTodoChange(false);
  //       setChangingItems([]);
  //       setDeletingTodosId([]);
  //     });
  // };

  const handleRemoveTodo = (todo: Todo) => {
    setIsTodoChange(true);
    setChangingItems(current => [...current, todo.id]);
    removeTodo(todo.id)
      .then(() => {
        setFilteredTodos(todos.splice(todos.indexOf(todo), 1));
        setIsTodoChange(false);
      })
      .catch(() => setAlarm(ErrorMessage.isUnableDeleteTodo))
      .finally(() => {
        setFilteredTodos(todos);
        setIsTodoChange(false);
        setChangingItems([]);
      });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filteredTodos,
      setFilteredTodos,

      alarm,
      setAlarm,

      tempTodo,
      setTempTodo,

      isTodoChange,
      setIsTodoChange,

      handleRemoveTodo,

      changingItems,
      setChangingItems,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
