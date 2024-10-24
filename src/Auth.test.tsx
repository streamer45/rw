import '@testing-library/jest-dom';

import {jest, expect, test} from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Auth } from './Auth';
import { GET_ME } from './queries';

test('unauthorized', async () => {
    const mock = {
        delay: 45,
        request: {
            query: GET_ME,
        },
        error: new Error('Unauthorized'),
    };

    const onAuth = jest.fn();

    render(
        <MockedProvider mocks={[mock]} addTypename={false}>
            <Auth onAuth={onAuth} />
        </MockedProvider>
    );
    expect(await screen.findByTestId('auth-query-progress')).toBeInTheDocument();
    expect(await screen.findByText('To start, please provide a valid Railway API')).toBeInTheDocument();
    expect(onAuth).not.toHaveBeenCalled();
});

test('authorized', async () => {
    const mock = {
        request: {
            query: GET_ME,
        },
        result: {
            data: {me: { id: 'id', email: 'streamer45@example.com' }},
        }
    };

    const onAuth = jest.fn();

    const {container} = render(
        <MockedProvider mocks={[mock]} addTypename={false}>
            <Auth onAuth={onAuth} />
        </MockedProvider>
    );

    await waitFor(() => { expect(onAuth).toHaveBeenCalled(); });
    expect(container).toBeEmptyDOMElement();
});
