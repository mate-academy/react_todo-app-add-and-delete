export enum TodoStatusOptions {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const todoStatusOptions = Object.values(
  TodoStatusOptions,
) as TodoStatusOption[];

export type TodoStatusOption = `${TodoStatusOptions}`;

export const isTodoStatusOption = (value: string) => {
  return todoStatusOptions.includes(value as TodoStatusOption);
};
