export default interface Request {
  action: "init" | "pub" | "sub" | "unsub",
  topic?: string,
  payload?: string
};