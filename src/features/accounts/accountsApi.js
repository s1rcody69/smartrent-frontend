import { apiSlice } from '../../app/api'

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: () => 'auth/tenants/',  // 👈 Changed from 'accounts/tenants/' to 'auth/tenants/'
      providesTags: ['Tenant'],
    }),
    getLandlordProfile: builder.query({
      query: () => 'auth/landlord/profile/',
      providesTags: ['LandlordProfile'],
    }),
    getTenantProfile: builder.query({
      query: () => 'auth/tenant/profile/',
      providesTags: ['TenantProfile'],
    }),
    updateLandlordProfile: builder.mutation({
      query: (data) => ({
        url: 'auth/landlord/profile/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['LandlordProfile'],
    }),
    updateTenantProfile: builder.mutation({
      query: (data) => ({
        url: 'auth/tenant/profile/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['TenantProfile'],
    }),
  }),
})

export const {
  useGetTenantsQuery,
  useGetLandlordProfileQuery,
  useGetTenantProfileQuery,
  useUpdateLandlordProfileMutation,
  useUpdateTenantProfileMutation,
} = accountsApi