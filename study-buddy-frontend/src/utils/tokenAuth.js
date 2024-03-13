
const initialState = {
    username: "",
    auth: false
}

export default function tokenAuth(state = initialState, action) {
    switch(action.type) {
        // TODO: state is not altered??
        case 'AUTH_TOKEN':
            console.log(action.payload)
            return {
                ...state,
                username: action.payload,
                auth: true
            }
        case 'LOGOUT':
            console.log("logout executed")
            return {
                ...state,
                username: "",
                auth: false
            }
        default:
            return state
    }
}
