import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const cryptoApiHeaders = {
    'X-RapidAPI-Key': '31d5dfce61msh42b219c0e75b199p123e53jsn6cadd7f223e0',
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
}

const baseUrl = 'https://coinranking1.p.rapidapi.com';

const createRequest = (url) => ({ url, headers: cryptoApiHeaders });


export const cryptoApi = createApi({
  reducerPath: 'cryptoApi', 
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
      getCryptos: builder.query({
          query: (count) => createRequest(`/coins?limit=${count}`),
      }),
      getExchanges: builder.query({
        query: () => createRequest('/exchanges')
    }),
      getCryptoDetails: builder.query({
          query: (uuid) => createRequest(`/coin/${uuid}`)
      }),
      getCryptoHistory: builder.query({
          query: ({uuid, timePeriod}) => createRequest(`/coin/${uuid}/history?timePeriod=${timePeriod}`)
    
      }),
   

  }),
});

export const { useGetCryptosQuery, useGetCryptoDetailsQuery, useGetCryptoHistoryQuery, useGetExchangesQuery } = cryptoApi;