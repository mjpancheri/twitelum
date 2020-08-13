import { API_URL } from "../config"

export const TweetsService = {
  like: (id) => 
    fetch(`${API_URL}/tweets/${id}/like?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
        method: 'POST'
    })
    .then( response => response.json() )
  ,
  carrega: () => 
    fetch(`${API_URL}/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
    .then(response => response.json())
  ,
  adiciona: conteudo => 
    fetch(`${API_URL}/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({ conteudo })
    })
    .then((response) => {
        return response.json();
    })
  ,
  remove: id => 
    fetch(`${API_URL}/tweets/${id}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
      method: 'DELETE',
    })
    .then((response) => {
      return response.json();
    })
  
}