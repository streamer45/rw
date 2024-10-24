import { useState } from 'react';
import { useQuery } from '@apollo/client';

import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Link from '@mui/joy/Link';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';

import {GET_ME} from './queries';

export function Auth({onAuth}: {onAuth: () => void}) {
    const { refetch, error, loading } = useQuery(GET_ME, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
        onCompleted: () => {
            setAuth(true);
            onAuth();
        },
    });
    const [token, setToken] = useState('');
    const [auth, setAuth] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (auth) {
        return null;
    }

    if (loading && !submitted) {
        return (
            <LinearProgress data-testid='auth-query-progress' sx={{marginTop: '50vh'}} />
        );
    }

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        setSubmitted(true);
        ev.preventDefault();
        sessionStorage.setItem('token', token);
        void refetch();
    };

    return (
        <Stack
            direction='column'
            spacing={2}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '10%',
            }}
        >
            <Stack
                direction='column'
                spacing={2}
            >
                <Typography level='title-lg'>
                    {'To start, please provide a valid Railway API '}
                    <Link href='https://docs.railway.app/reference/public-api#personal-token' target='_blank' rel='noopener noreferrer'>{'personal token'}</Link>
                </Typography>

                <form className='auth' onSubmit={handleSubmit}>
                    <Stack
                        direction='column'
                        spacing={2}
                    >
                        <Input
                            slotProps={{
                                input: {
                                    autoComplete: 'current-password',
                                },
                            }}
                            type='password' value={token} size='md' placeholder='Paste your token in here…' required onChange={(ev) => { setToken(ev.target.value); }}/>

                        { submitted && error &&
                        <FormControl error>
                            <FormHelperText >
                                <InfoOutlined/>
                                {'Authentication failed. Please try again with a valid token.'}
                            </FormHelperText>
                        </FormControl>
                        }

                        <Button type='submit' size='md' variant='solid' loading={submitted && loading}>{'Let\'s go!'}</Button>
                    </Stack>
                </form>
            </Stack>
        </Stack>
    );
}
