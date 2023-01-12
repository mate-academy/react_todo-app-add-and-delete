export const isFieldRequired = {
  value: true,
  message: 'This field is required',
};

export const isEmailValid = {
  value: /\S+@\S+\.\S+/,
  message: 'E-mail is not valid',
};

export const isMinValue = (value: string, min: number) => {
  if (!value) {
    return true;
  }

  return value.length >= min || `Must be ${min} or more characters in length`;
};
