import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RegisterState {
  isRegistered: boolean
  isLoading: boolean
  error:  string | null
}

const initialState: RegisterState = {
  isRegistered: false,
  isLoading: false,
  error:  null
}

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerStart(state: RegisterState) {
      state.isLoading = true
    },
    registerSucess(state: RegisterState){
      state.isLoading = false
      state.isRegistered = true
    },
    registerFailure(state: RegisterState, action: PayloadAction<string>){
      state.isLoading = false
      state.error = action.payload
    }
  }
})


export default registerSlice.reducer