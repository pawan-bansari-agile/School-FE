export class Student {
  constructor(
    public _id: string,
    public name: string,
    public parentNumber: number,
    public address: string,
    public std: number,
    public photo: string,
    public dob: Date,
    public status: boolean,
    public deleted: boolean,
    public school: string,
    public __v: number,
    public message: string
  ) {
    _id = _id;
    name = name;
    parentNumber = parentNumber;
    address = address;
    std = std;
    photo = photo;
    dob = dob;
    status = status;
    deleted = deleted;
    school = school;
    __v = __v;
    message = message;
  }
}

export class UpdatedStudent {
  constructor(
    public _id: string,
    public name: string,
    public parentNumber: number,
    public address: string,
    public std: number,
    public photo: string,
    public dob: Date,
    public status: boolean,
    public deleted: boolean,
    public school: string,
    public __v: number
  ) {
    _id = _id;
    name = name;
    parentNumber = parentNumber;
    address = address;
    std = std;
    photo = photo;
    dob = dob;
    status = status;
    deleted = deleted;
    school = school;
    __v = __v;
  }
}
