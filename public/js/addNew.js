import axios from 'axios';
import { showAlert } from './alerts';


const newPlant = document.querySelector('.form-new-plant');


export const catAdd = async (data) => {
  try {
    
    let res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/data/',
      data: {
        data:data,
        
        }
      
    });

  
      
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
      
   
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



const bpAddBtn = document.querySelector('.bpAdd');

