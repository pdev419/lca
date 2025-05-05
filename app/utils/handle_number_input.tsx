const handleNumberInput = (
  inputValue: string,
  setValue = (s: string) => {}
) => {
  const value = parseFloat(inputValue);
  setValue(`${isNaN(value) ? 0 : value}`);
};

export { handleNumberInput };
