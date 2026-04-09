export function logged()
{
    if(localStorage.getItem("Token"))
    {
        return true;
    }
    else{
        return false;
    }
}

export function logout()
{
    localStorage.removeItem("Token");
}