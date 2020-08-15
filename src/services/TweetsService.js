import { API_URL } from "../config"
const token = localStorage.getItem('TOKEN');

export const TweetsService = {
  like: (id) => 
    fetch(`${API_URL}/tweets/${id}/like?X-AUTH-TOKEN=${token}`, {
        method: 'POST'
    })
    .then( response => response.json() )
  ,
  carrega: () => 
    fetch(`${API_URL}/tweets?X-AUTH-TOKEN=${token}`)
    .then(response => response.json())
  ,
  adiciona: conteudo => 
    fetch(`${API_URL}/tweets?X-AUTH-TOKEN=${token}`, {
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
    fetch(`${API_URL}/tweets/${id}?X-AUTH-TOKEN=${token}`, {
      method: 'DELETE',
    })
    .then((response) => {
      return response.json();
    })
  
}