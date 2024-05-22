export default interface LoginDTO {
  email: string;
  password: string;
}
export const LoginDTOSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
  required: ["email", "password"],
};
