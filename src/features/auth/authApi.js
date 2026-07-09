import { apiSlice } from '../../app/api'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({ url: 'auth/register/', method: 'POST', body: data }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: 'auth/login/', method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: (refresh) => ({ url: 'auth/logout/', method: 'POST', body: { refresh } }),
    }),
    getMe: builder.query({
      query: () => 'auth/me/',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      query: (refresh) => ({ url: 'auth/token/refresh/', method: 'POST', body: { refresh } }),
    }),
    getLandlordProfile: builder.query({
      query: () => 'auth/landlord/profile/',
      providesTags: ['User'],
    }),
    getTenantProfile: builder.query({
      query: () => 'auth/tenant/profile/',
      providesTags: ['User'],
    }),
    getAvailableTenants: builder.query({  // 👈 NEW
      query: () => 'auth/available-tenants/',
      providesTags: ['AvailableTenants'],
    }),
    updateLandlordProfile: builder.mutation({
      query: (data) => ({ url: 'auth/landlord/profile/', method: 'PATCH', body: data }),
      invalidatesTags: ['User'],
    }),
    updateTenantProfile: builder.mutation({
      query: (data) => ({ url: 'auth/tenant/profile/', method: 'PATCH', body: data }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  useGetLandlordProfileQuery,
  useGetTenantProfileQuery,
  useGetAvailableTenantsQuery,  // 👈 NEW
  useUpdateLandlordProfileMutation,
  useUpdateTenantProfileMutation,
} = authApi