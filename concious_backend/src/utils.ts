export function random(len:number):string
{
    let option:string = "asfhduhfasndoiijajdofndnfoij1243456789";

    let optionLen = option.length;
    let res = ''
    for(let i =0 ; i<len ; i++)
    {
        res+=option[Math.floor((Math.random()*optionLen))]
    }

    return res;
}