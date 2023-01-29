/* eslint-disable max-len */
import { useState } from 'react';

export const useTodoChange = (): [number | number[], boolean, ((changingTodosId: number | number[], state: boolean) => void)] => {
  const [currentTodoId, setCurrentTodoId] = useState<number | number[]>(-1);
  const [changingState, setChangingState] = useState(false);

  const setTodoChange = (changingTodosId: number | number[], state: boolean) => {
    setChangingState(state);
    setCurrentTodoId(changingTodosId);
  };

  return [currentTodoId, changingState, setTodoChange];
};
