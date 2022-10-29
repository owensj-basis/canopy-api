// json can't natively serialize bigints
export const toJSON = object => {
  return JSON.parse(
    JSON.stringify(object, (key, value) =>
      typeof value === 'bigint' ? parseInt(value.toString()) : value
    )
  );
};
