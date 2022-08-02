import axios from 'axios';
import {FRIEND_GET_SUCCESS,MESSAGE_GET_SUCCESS,MESSAGE_SEND_SUCCESS,THEME_GET_SUCCESS,THEME_SET_SUCCESS} from "../types/messengerType";

export const getFriends = (token) => async(dispatch) => {
     try{
          console.log(token);
          const response = await axios.post(`http://localhost:5000/api/messenger/get-friends/`,{
               token,
          });
          console.log(response)
           dispatch({
                type: FRIEND_GET_SUCCESS,
                payload : {
                     friends : response.data.friends
                }
           })

     }catch (error){
          console.log(error.response.data);
     }
}

export const messageSend = (data, token) => async(dispatch) => {
    try{
     const response = await axios.post('http://localhost:5000/api/messenger/send-message',{data,
          token,
     });
     console.log(response);
     dispatch({
          type : MESSAGE_SEND_SUCCESS,
          payload : {
               message : response.data.message
          }
     })
    }catch (error){
     console.log(error.response.data);
    }
}


export const getMessage = (id, token) => {
     return async(dispatch) => {
          try{
               const response = await axios.post(`http://localhost:5000/api/messenger/get-message/${id}`,{
                    token,
               })
               console.log(response);
              dispatch({
                   type : MESSAGE_GET_SUCCESS,
                   payload : {
                    message : response.data.message
                   }
              })
          }catch (error){
               console.log(error.response.data)
          }
     }
}


export const ImageMessageSend = (data) => async(dispatch)=>{
     
     try{
          const response = await axios.post('http://localhost:5000/api/messenger/image-message-send',data,{

          });
          dispatch({
               type: MESSAGE_SEND_SUCCESS,
               payload : {
                    message : response.data.message
               }
          })
     }catch (error){
          console.log(error.response.data);

     }

}

export const seenMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post('http://localhost:5000/api/messenger/seen-message',msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const updateMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post('http://localhost:5000/api/messenger/delivared-message',msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const getTheme = () => async(dispatch) => {

     const theme = localStorage.getItem('theme');
     dispatch({
          type: "THEME_GET_SUCCESS",
          payload : {
               theme : theme? theme : 'white'
          }
     })

}


export const themeSet = (theme) => async(dispatch) => {

     localStorage.setItem('theme',theme);
     dispatch({
          type: "THEME_SET_SUCCESS",
          payload : {
               theme : theme
          }
     })
     
}

export const imageConvert = (data) => async() =>{
     try{
          const response = await axios.post('http://localhost:5000/api/messenger/convert',data);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
} 
