


const newUser=(user)=>{
    return axios({
        url:"https://webrtc-api.ddns.net/auth/signup",
        method:"POST",
        data:user,
    })
}

export {newUser};
