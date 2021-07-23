import image from './black-logo.png'
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from 'axios';

function Home(props){
const [isLoggedIn,ChangeLoginStatus] = useState(false)
const [state,setState] = useState({username:'',newmessage:'',OpenedChat:'ChatOne'});
const [messageList, updateMessageList] = useState([])
const toUpdate = useRef(true);
const chatNameCoded = {ChatOne:'Chat One', ChatTwo:'Chat Two', ChatThree:'Chat Three'};
const handleChange = (e) =>{
    setState({...state, username:e.target.value})
}
const sendMessage = async ()=>{
    let messagedata = {}
    messagedata.user = state.username
    messagedata.OpenedChat =state.OpenedChat
    messagedata.message = state.newmessage
    messagedata.ts = Date(Date.now())
    await axios.post('https://chatting-backend-app.herokuapp.com/incomingmessage',messagedata)
    .then(()=>{
    })
    .catch((e)=>{
        console.log(e)
    })
    setState({...state, newmessage:''})
    toUpdate.current = true
  }
const enterPressed = (e) =>{
    if(e.key === 'Enter' && state.newmessage !== ''){
        sendMessage()
    }
}
useLayoutEffect(() => {
    if(!isLoggedIn){
    const uservalue = localStorage.getItem('username')
    if(uservalue){
        setState({...state, username: uservalue})
        ChangeLoginStatus(true)
    }
}
}, [state,isLoggedIn])

useEffect(()=>{
    function checkingUpdate(){
    if(isLoggedIn){
        axios.post('https://chatting-backend-app.herokuapp.com/readingmessages',{OpenedChat:state.OpenedChat})
            .then((res)=>{
                const messageListdata = [...res.data]
                if((messageListdata.length !== messageList.length)&& (messageList.length!==0)){
                    toUpdate.current = true
                    console.log('updated')
                }
            })
    }
}
    setInterval(checkingUpdate,1000)
})

useEffect(() => {
    if(isLoggedIn){
    const allchatelements = document.getElementsByClassName('Chat-list-element')
    for(let i=0;i<allchatelements.length;i++){
      allchatelements[i].style.backgroundColor = '#ededed';
    }
    const firstElement = document.getElementById(state.OpenedChat)
    firstElement.style.backgroundColor = 'white';
    if(toUpdate.current){
        console.log('Rerendering messages')
            axios.post('https://chatting-backend-app.herokuapp.com/readingmessages',{OpenedChat:state.OpenedChat})
            .then((res)=>{
                const messageListdata = [...res.data]
                updateMessageList( messageListdata)
                messageListdata.sort(function(a,b){
                return new Date(b.ts) - new Date(a.ts);
            });
          const messages = messageListdata.map(i=>{
          if(i.user===state.username)return <div className="message">{i.message}</div>
          return <div className="message2"><div className="usernameofothers">{i.user}</div><div>{i.message}</div></div>
        })
        setState({...state,messages: messages})
        toUpdate.current = false
      })
      .catch((e)=>{
          console.log(e)
      })
    }
}
}, [state,toUpdate,isLoggedIn]);
  if(isLoggedIn){
  return (
    <div className="App">
      <div className="Chat-list">
      <div className="header">
      <img src={image} alt="Logo" className="logo"/>
        <div className="title"> Welcome to the Chat {state.username}</div>
        <div className="back-icon" title="Log Out" style={{cursor:"pointer"}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </div>
      </div>
    <div className="Chat">
      <div className="Chat-list-element" id="ChatOne" onClick={()=>{setState({...state,OpenedChat:'ChatOne'});toUpdate.current=true;}}>
        <img src={image} alt="Logo-1" className="logo" />
        <div className="Chat-Name">
        Chat One
        </div>
      </div>
        <div className="Chat-list-element" id="ChatTwo" onClick={()=>{setState({...state,OpenedChat:'ChatTwo'});toUpdate.current=true;}}>
        <img src={image} alt="Logo-2" className="logo" />
        <div className="Chat-Name">
        Chat Two
        </div>
      </div>
        <div className="Chat-list-element" id="ChatThree" onClick={()=>{setState({...state,OpenedChat:'ChatThree'});toUpdate.current=true;}}>
        <img src={image} alt="Logo-3" className="logo" />
        <div className="Chat-Name">
        Chat Three
        </div>
      </div>
      </div>
      </div>
      <div className="Chat-details">
            <div className="Chat-list-element">
            <img src={image} alt="Logo-1" className="logo" />
        <div className="Chat-Name">
        {chatNameCoded[state.OpenedChat]}
        </div>
      </div>
        <div className="message-content">
            {state.messages}
        </div>
        <div className="input-message">
        <input className="input-box" placeholder="Type a message" value={state.newmessage} onChange={(e)=>{setState(state=>({...state,newmessage:e.target.value}));}} onKeyPress={enterPressed} />
        <button type="button" className="send-button" onClick={sendMessage} />
      </div>
      </div>
    </div>
    
  );
}
else {
    return (
    <div>
    <input type="text" onChange={handleChange} />
    <button onClick={()=>{if(state.username !== ''){ChangeLoginStatus({isLoggedIn:true});localStorage.setItem('username',state.username)}}}>Submit Username</button>
</div>
    )
}
}

export default Home;