const USERNAME_KEY = "username";

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

export function getUsername() {
    return localStorage.getItem(USERNAME_KEY)?.trim() || "User";
}

export function setAuthSession(token: string, username: string) {
    localStorage.setItem("Token", token);
    localStorage.setItem(USERNAME_KEY, username.trim());
}

export function logout()
{
    localStorage.removeItem("Token");
    localStorage.removeItem(USERNAME_KEY);
}