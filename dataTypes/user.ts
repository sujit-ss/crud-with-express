export type User = {
  id?: String;
  name: String;
  gender: String;
  age: number;
  email: String;
  contact: String;
  password: String;
};

export type UserLogin = {
  email: String;
  password: String;
};

export type jwtAlgorithem = {
  id: String,
  email: String,
}
