
export class RegisterDto implements IRegisterDto {
    username: string | undefined;
    knowAs: string | undefined;
    dateOfBirth: Date | undefined;
    city: string | undefined;
    country: string | undefined;
    password: string | undefined;
    gender: string | undefined;

    constructor(data?: IRegisterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.username = _data["username"];
            this.knowAs = _data["knowAs"];
            this.dateOfBirth = _data["dateOfBirth"];
            this.city = _data["city"];
            this.country = _data["country"];
            this.password = _data["password"];
            this.gender = _data["gender"];
        }
    }

    static fromJS(data: any): RegisterDto {
        data = typeof data === 'object' ? data : {};
        let result = new RegisterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["username"] = this.username;
        data["knowAs"] = this.knowAs;
        data["dateOfBirth"] = this.dateOfBirth;
        data["city"] = this.city;
        data["country"] = this.country;
        data["password"] = this.password;
        data["gender"] = this.gender;
        return data;
    }
}

export interface IRegisterDto {
    username: string | undefined;
    knowAs: string | undefined;
    dateOfBirth: Date | undefined;
    city: string | undefined;
    country: string | undefined;
    password: string | undefined;
    gender: string | undefined;
}
