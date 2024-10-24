import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App.tsx';

import '@fontsource/inter';

const httpLink = createHttpLink({
    uri: 'http://localhost:9045/graphql/v2',
});

const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem('token');
    return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const rootEl = document.getElementById('root');

if (rootEl) {
    createRoot(rootEl).render(
        <StrictMode>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </StrictMode>
    );
}

