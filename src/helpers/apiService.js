import axios from 'axios'

export const requestAPICall = async (url) => {
  return await axios.get(url)
}

export const requestAPICallBody = async (url,userData) =>{
  console.log("Value of reuestAPICallBody:::",url,userData)
   return await axios.post(url,
    userData
  )
}
