export const getEnumKeys = <T extends {}>(enumToDeconstruct: T)
: Array<keyof typeof enumToDeconstruct> => {
  return Object
    .keys(enumToDeconstruct) as Array<keyof typeof enumToDeconstruct>;
};
