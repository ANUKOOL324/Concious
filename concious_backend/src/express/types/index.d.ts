import * as express from 'express'

declare global{
    namespace Express{
        interface Request{//TypeScript allows you to extend existing interfaces using the same name as Express’s Request interface does not include userId.
            userId?:string |  Types.ObjectId;
        }
    }
}

export{};