export class User {
  constructor(
    public access_token: string,
    public userName: string,
    public email: string,
    public role: string,
    public forgetPwdToken: string,
    public forgetPwdExpires: Date,
    public deleted: string,
    public _id: string,
    public __v: number,

    public message: string,
    public expirationDate?: Date
  ) {
    access_token = access_token;
    userName = userName;
    email = email;
    role = role;
    forgetPwdToken = forgetPwdToken;
    forgetPwdExpires = forgetPwdExpires;
    deleted = deleted;
    _id = _id;
    __v = __v;
    message = message;
    expirationDate = expirationDate;
  }
}
