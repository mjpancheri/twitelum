import React, { Component, Fragment } from 'react'
import Cabecalho from '../../components/Cabecalho'
import Widget from '../../components/Widget'

import './loginPage.css'
import { NotificacaoContext } from '../../context/NotificacaoContext'

class LoginPage extends Component {
    static contextType = NotificacaoContext;

    fazerLogin = (event) => {
        event.preventDefault();
        
        const dadosLogin = {
            login: this.refs.inputLogin.value,
            senha: this.refs.inputSenha.value,
        }
        console.log(dadosLogin);
        fetch('http://twitelum-api.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLogin)
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
                this.context.setMsg('Bem vindo ao Twitelum, login foi um sucesso!');
                this.props.history.push('/');
            }
        })
        .catch(err => {
            //console.error(`[Erro ${err.status}]`, err.message);
            this.context.setMsg(`[Erro ${err.status}] ${err.message}`);
        })
    }

    render() {
        return (
            <Fragment>
                <Cabecalho />
                <div className="loginPage">
                    <div className="container">
                        <Widget>
                            <h2 className="loginPage__title">Seja bem vindo!</h2>
                            <form className="loginPage__form" action="/" onSubmit={this.fazerLogin}>
                                <div className="loginPage__inputWrap">
                                    <label className="loginPage__label" htmlFor="login">Login</label> 
                                    <input ref="inputLogin" className="loginPage__input" type="text" id="login" name="login"/>
                                </div>
                                <div className="loginPage__inputWrap">
                                    <label className="loginPage__label" htmlFor="senha">Senha</label> 
                                    <input ref="inputSenha" className="loginPage__input" type="password" id="senha" name="senha"/>
                                </div>
                                {/* <div className="loginPage__errorBox">
                                    Mensagem de erro!
                                </div> */}
                                <div className="loginPage__inputWrap">
                                    <button className="loginPage__btnLogin" type="submit">
                                        Logar
                                    </button>
                                </div>
                            </form>
                        </Widget>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default LoginPage