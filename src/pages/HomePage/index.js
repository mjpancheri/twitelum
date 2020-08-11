import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import { API_URL } from "../../config";
import { Helmet } from 'react-helmet';

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            tweets: [],
            novoTweet: ''
        }

        this.usuario = '@mjpancheri';
        this.token = localStorage.getItem('TOKEN');
    }

    componentDidMount(){
        //const token = localStorage.getItem('TOKEN');
        fetch(`${API_URL}/tweets?X-AUTH-TOKEN=${this.token}`)
        .then(response => response.json())
        .then((tweets) => {
            this.setState({
                tweets
            })
        })
    }

    adicionaTweet = event => {
        //const token = localStorage.getItem('TOKEN');
        event.preventDefault();
        if(this.state.novoTweet.length > 0){
            fetch(`${API_URL}/tweets?X-AUTH-TOKEN=${this.token}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ conteudo: this.state.novoTweet, login: 'omariosouto' })
            })
            .then((response) => {
                return response.json();
            })
            .then((tweetServer) => {
                //console.log(tweetServer);

                this.setState({
                    tweets: [tweetServer, ...this.state.tweets],
                    novoTweet: ''
                })
            })
        }
    };

    renderTweet = () => {
        return this.state.tweets.length > 0 ? this.state.tweets.map(
            ({ _id, conteudo, usuario, likeado, totalLikes, removivel }, idx) => {
                //console.log('user:', usuario);
                return <Tweet
                    key={_id}
                    id={_id}
                    texto={conteudo} 
                    usuario={usuario}
                    likeado={likeado}
                    totalLikes={totalLikes} 
                    removivel={removivel}
                    removeHandler={(event) => this.removeTweet(_id)} />
                }
            )
            : 'Sua lista está vazia, que tal criar um tweet?'
    }

    removeTweet = (id) => {
        //const token = localStorage.getItem('TOKEN');
        fetch(`${API_URL}/tweets/${id}?X-AUTH-TOKEN=${this.token}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ conteudo: this.state.novoTweet, login: 'omariosouto' })
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            //console.log(response);
            const newTweets = this.state.tweets.filter( (tweet) => tweet._id !== id);
            this.setState({
                tweets: newTweets
            })
        })
    }

  render() {
      const { novoTweet } = this.state;
      const limite = 140;
      const tweetMaiorPermitido = novoTweet.length > limite;
      const classeTweetInvalido = tweetMaiorPermitido ? 'novoTweet__status--invalido' : '';
      const botaoDesabilitado = tweetMaiorPermitido || novoTweet.length === 0;

    return (
      <Fragment>
        <Helmet>
            <title>Twitelum ({`${this.state.tweets.length}`})</title>
        </Helmet>
        <Cabecalho>
            <NavMenu usuario={this.usuario} />
        </Cabecalho>
        <div className="container">
            <Dashboard>
                <Widget>
                    <form className="novoTweet" onSubmit={this.adicionaTweet}>
                        <div className="novoTweet__editorArea">
                            <span 
                                className={`novoTweet__status ${classeTweetInvalido}`}
                            >{novoTweet.length}/{limite}</span>
                            <textarea 
                                className="novoTweet__editor" 
                                value={novoTweet}
                                onChange={ (event) => this.setState({novoTweet: event.target.value})}
                                placeholder="O que está acontecendo?"
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="novoTweet__envia"
                            disabled={botaoDesabilitado}
                        >Tweetar</button>
                    </form>
                </Widget>
                <Widget>
                    <TrendsArea />
                </Widget>
            </Dashboard>
            <Dashboard posicao="centro">
                <Widget>
                    <div className="tweetsArea">
                        {this.renderTweet()}
                    </div>
                </Widget>
            </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;
