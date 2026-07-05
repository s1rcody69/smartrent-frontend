import { apiSlice } from '../../app/api'

export const propertiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params = '') => `properties/${params}`,
      providesTags: ['Property'],
    }),
    getPropertyById: builder.query({
      query: (id) => `properties/${id}/`,
      providesTags: ['Property'],
    }),
    createProperty: builder.mutation({
      query: (data) => {
        // Only use FormData if cover_image is a real File upload
        if (data.cover_image instanceof File) {
          const formData = new FormData()
          Object.entries(data).forEach(([k, v]) => {
            if (v !== null && v !== undefined) formData.append(k, v)
          })
          return { url: 'properties/', method: 'POST', body: formData }
        }
        // Otherwise send as JSON — cover_image is a URL string or absent
        const payload = { ...data }
        if (!payload.cover_image) delete payload.cover_image
        return {
          url: 'properties/',
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        }
      },
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...data }) => {
        if (data.cover_image instanceof File) {
          const formData = new FormData()
          Object.entries(data).forEach(([k, v]) => {
            if (v !== null && v !== undefined) formData.append(k, v)
          })
          return { url: `properties/${id}/`, method: 'PATCH', body: formData }
        }
        const payload = { ...data }
        if (!payload.cover_image) delete payload.cover_image
        return {
          url: `properties/${id}/`,
          method: 'PATCH',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        }
      },
      invalidatesTags: ['Property'],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({ url: `properties/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Property'],
    }),
    getUnits: builder.query({
      query: (params = '') => `units/${params}`,
      providesTags: ['Unit'],
    }),
    getUnitById: builder.query({
      query: (id) => `units/${id}/`,
      providesTags: ['Unit'],
    }),
    createUnit: builder.mutation({
      query: (data) => ({ url: 'units/', method: 'POST', body: data }),
      invalidatesTags: ['Unit', 'Property'],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...data }) => ({ url: `units/${id}/`, method: 'PATCH', body: data }),
      invalidatesTags: ['Unit'],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({ url: `units/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Unit', 'Property'],
    }),
  }),
})

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = propertiesApi