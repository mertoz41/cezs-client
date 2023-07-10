const initialState = {
    currentUser: null
}
function userReducer(state = initialState, action){
    switch(action.type){
        case 'USER_LOGIN':
            return {currentUser: action.currentUser};
        default: 
            return {state}
    }
}

export default userReducer