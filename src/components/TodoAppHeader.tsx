import React, { useContext } from 'react';
import { ToggleAllButton } from './ToogleAllButton';
import { TodosContext } from '../providers/TodosProvider';
import { NewTodoForm } from './NewTodoForm';

type Props = {};

export const TodoAppHeader: React.FC<Props> = () => {
  const { todos } = useContext(TodosContext);

  return (
    <header className="todoapp__header">
      {!!todos.length && <ToggleAllButton />}

      <NewTodoForm />
    </header>
  );
};
