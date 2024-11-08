import React from 'react';
import styled from 'styled-components';
import ErrorPage from '../utilis/Images/ErrorImage.gif'
import { useNavigate } from 'react-router-dom';

const ErrorRoute = () => {
const navigate = useNavigate()

const handleClick = () => {
    navigate("/")
}
  return (
    <Container>
    <div className='ErrorPage'>
      <img src={ErrorPage} alt=""/>
      <button type='button' onClick={()=>handleClick()}>Go Home</button>
    </div>
    
    </Container>
    
  )
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
      @media screen and (min-width: 320px) and (max-width: 1020px){
        height: 400vh;
        width: 400%;
        display: flex;
        justify-content:center;
        align-item:center;
      }
    background-color: #d7e3fc;
    
    .ErrorPage{
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 320px) and (max-width: 1020px){
    display: flex;
    justify-content:center;
    align-item:center;
    }
    justify-content: center;
    
    img{
    padding: 80px;
    width: 900px;
    height:700px;
    margin-left: 400px;
    button{

    }
    }
    button{
    border: none;
    width: 250px;
    color: #1a659e;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 30px;
    margin: 1px 725px;
    cursor: pointer;
    background-color: #d7e3fc;
    }
}
`

export default ErrorRoute;
