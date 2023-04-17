export class School {
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
}

export class UpdatedSchool {
  constructor(
    public name: string,
    public email: string,
    public address: string,
    public photo: string,
    public zipCode: number,
    public city: string,
    public state: string,
    public country: string,
    public _id: string
  ) {
    name = name;
    email = email;
    _id = _id;
    address = address;
    photo = photo;
    zipCode = zipCode;
    city = city;
    state = state;
    country = country;
  }
}
