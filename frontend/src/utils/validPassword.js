export function isValidPassword(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasLetter = /[a-zA-Z]/;

  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasLetter.test(password)
  );
}
