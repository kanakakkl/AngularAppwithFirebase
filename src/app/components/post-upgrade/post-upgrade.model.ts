import { LocationAddress } from "./post-upgrade-address.model";

export class PostUpgrade {
    $key : string;
    Id :string;
    UserId :string;
    EmailId:string;
    CategoryId  :string;
    SubCategoryId  :string;
    MediaUrl :string;
    MediaType : any;
    FirstName:string;
    LastName:string;
    Password: string;
    CreateTime:string;
    ModifyTime:string;
    Phone: number;
    TopicTitle  : string;
    Description : string;
    FlaggedStatus : string;
    IsReported : boolean;
    IsProfanity : boolean;
    ReportedUsers : string;
    Address : Array<LocationAddress>;
    PostStatus : string;
}

