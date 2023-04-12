export class School {
  // data: {
  //   access_token: string;
  //   existingUser: {
  //     userName: string;
  //     email: string;
  //     role: string;
  //     forgetPwdToken: string;
  //     forgetPwdExpires: Date;
  //     deleted: string;
  //     _id: string;
  //     __v: number;
  //   };
  // };
  // message: string;
  // expirationDate?: Date;

  constructor(
    public access_token: string,
    public name: string,
    public email: string,
    public address: string,
    public photo: string,
    public zipCode: number,
    public city: string,
    public state: string,
    public country: string,
    public role: string,
    public forgetPwdToken: string,
    public forgetPwdExpires: Date,
    public deleted: string,
    public _id: string,
    public __v: number,
    // _token: string;
    // _tokenExpirationDate: Date;
    public message: string,
    public expirationDate?: Date
  ) {
    access_token = access_token;
    name = name;
    email = email;
    role = role;
    forgetPwdToken = forgetPwdToken;
    forgetPwdExpires = forgetPwdExpires;
    deleted = deleted;
    _id = _id;
    __v = __v;
    address = address;
    photo = photo;
    zipCode = zipCode;
    city = city;
    state = state;
    country = country;
    message = message;
    expirationDate = expirationDate;
  }

  // get token() {
  //   if (!this.forgetPwdExpires || new Date() > this._tokenExpirationDate) {
  //     return null;
  //   }
  //   return this._token;
  // }
}
