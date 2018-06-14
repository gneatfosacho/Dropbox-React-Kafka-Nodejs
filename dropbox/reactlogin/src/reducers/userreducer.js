import {GET_USER} from "../actions/index";
import {UPDATE_USER} from "../actions/index";

const initialState = {

    firstName: '',
    lastName: '',
    password: '',
    email: '',
    contactno: '',
    interests:'',
    lastLoginTime:''
};

const userdata = (state = initialState, action) => {

    switch (action.type) {

        case GET_USER :
            return {
                firstName: action.payload.firstname,
                lastName: action.payload.lastname,
                email: action.payload.email,
                password: action.payload.password,
                contactno: action.payload.contactno,
                interests:action.payload.interests,
                lastLoginTime:action.payload.lastlogin,

            };

        case UPDATE_USER :
            return {
                ...state,
                firstName: action.payload.firstname,
                lastName: action.payload.lastname,
                contactno: action.payload.contactno,
                interests:action.payload.interests
            }
        default :
            return state;

    }
};

export default userdata;
