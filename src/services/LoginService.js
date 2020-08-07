import { API_URL } from "../config";

export const LoginService = {
  logar({login, senha }) {
    return fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, senha })
    })
    .then(async response => {
        if(!response.ok) {
            const respErroServer = await response.json();
            const errosObj = Error(respErroServer.message);
            errosObj.status = response.status;
            throw errosObj;
        }

        return response.json();
    })
    .then(dadosServer => {
        const token = dadosServer.token;
        if(token){
            localStorage.setItem('TOKEN', token);
            return;
        }
        throw new Error('Token not found');
    })
  }
}