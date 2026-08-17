import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/interfaces/user.interface";


interface initialStateProp{
    isLoggedIn:boolean,
    user:User |null
    isLoading:boolean
}

const initialState:initialStateProp={
    isLoggedIn:false,
    user:null,
    isLoading:false
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        logIn(state,action){
            state.isLoggedIn=true;
            state.user =action.payload;
        },
        logOut(state){
            state.isLoggedIn=false;
            state.user =null;
        },
        setLoading(state){
            state.isLoading=true
        },
        updateUserDetail(state,action){
            state.user=action.payload;
        }
    }
})

export const {logIn,logOut,updateUserDetail,setLoading}=authSlice.actions

export default authSlice.reducer