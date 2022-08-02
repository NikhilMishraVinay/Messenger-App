import React from 'react';

const ActiveFriend = ({user,setCurrentFriend}) => {
  return (
       
            
                 
     <div onClick={()=> setCurrentFriend({
          _id : user._id,
          email: user.email,
          userName : user.userName
       })} className='image'>
       <img src={`http://localhost:5000/api/messenger/user-image/${user._id}`} alt='' />
       <div className='active-icon'></div>
     </div>

                 

                
                 

            

       
  )
};

export default ActiveFriend;
