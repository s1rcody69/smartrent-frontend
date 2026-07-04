import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, refreshToken: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, tokens } = action.payload
      state.user = user
      state.accessToken = tokens.access
      state.refreshToken = tokens.refresh
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.access
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
    },
  },
})

export const { setCredentials, setAccessToken, clearCredentials } = authSlice.actions
export default authSlice.reducer