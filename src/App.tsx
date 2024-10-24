import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';

import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Table from '@mui/joy/Table';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Tooltip from '@mui/joy/Tooltip';
import Snackbar from '@mui/joy/Snackbar';

import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import PublicIcon from '@mui/icons-material/Public';

import {LogsModal} from './Logs';
import {Auth} from './Auth';
import {getDockerURL} from './utils';

import {
    GET_ME,
    GET_DEPLOYMENTS,
    CREATE_PROJECT,
    CREATE_SERVICE,
    CREATE_SERVICE_DOMAIN,
    DELETE_PROJECT,
} from './queries';

function Dashboard() {
    const meRes = useQuery(GET_ME);
    const projectsRes = useQuery(GET_DEPLOYMENTS);

    const [createProjectFn] = useMutation(CREATE_PROJECT);
    const [createServiceFn] = useMutation(CREATE_SERVICE);
    const [createServiceDomainFn] = useMutation(CREATE_SERVICE_DOMAIN);

    const [createdName, setCreatedName] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createDomainLoading, setCreateDomainLoading] = useState(false);

    const [deleteProjectFn] = useMutation(DELETE_PROJECT);

    const [showDeployModal, setShowDeployModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateDomainModal, setShowCreateDomainModal] = useState(false);
    const [deletedName, setDeletedName] = useState('');

    const [deleteData, setDeleteData] = useState<{projectId?: string, serviceName?: string}>({});
    const [confirmName, setConfirmName] = useState('');

    const [deploymentId, setDeploymentId] = useState('');
    const [showLogsModal, setShowLogsModal] = useState(false);

    const [image, setImage] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [domainPort, setDomainPort] = useState('');
    const [domainData, setDomainData] = useState<{environmentId?: string, serviceId?: string}>({});
    const [domainCreated, setDomainCreated] = useState('');

    const [deployError, setDeployError] = useState('');

    // Avoid polling when tab is not visibile.
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                projectsRes.stopPolling();
            } else {
                projectsRes.startPolling(1000);
            }
        };
        projectsRes.startPolling(1000);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    if (!meRes.data) {
        return null;
    }

    const me = meRes.data.me;

    // Parsing the queried data to extract the information we want to surface.
    const instances = projectsRes.data ? projectsRes.data.projects.edges.map((el) => {
        const projectId = el.node.id;
        return el.node.services.edges.map((el) => {
            const serviceName = el.node.name;
            const serviceId = el.node.id;
            return el.node.serviceInstances.edges.map((el) => ({
                projectId,
                serviceName,
                serviceId,
                status: el.node.latestDeployment?.status,
                deploymentId: el.node.latestDeployment?.id,
                sourceImage: el.node.source?.image,
                environmentId: el.node.environmentId,
                serviceDomain: el.node.domains.serviceDomains[0]?.domain,
            })).filter(el => Boolean(el.sourceImage)); // only show containers
        }).flat();
    }).flat() : [];

    const handleLogOut = () => {
        sessionStorage.removeItem('token');
        location.reload();
    };

    const handleDeployService = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        setCreateLoading(true);

        createProjectFn().then(({data}) => {
            if (data?.projectCreate.id) {
                const variables = {
                    projectId: data.projectCreate.id,
                    image,
                    ...(serviceName !== '') && ({name: serviceName}),
                };

                return createServiceFn({ variables });
            } else {
                throw new Error('missing project id');
            }
        }).then(({data}) => {
            if (data) {
                setCreatedName(data.serviceCreate.name);
            }
        }).catch((err: Error) => {
            setDeployError(err.message);
        }).finally(() => {
            setImage('');
            setServiceName('');
            setShowDeployModal(false);
            setCreateLoading(false);
        });
    };

    const handleDelete = () => {
        // TODO: handle non matching case
        if (deleteData.serviceName === confirmName) {
            deleteProjectFn({variables: {projectId: deleteData.projectId!}}).then(() => {
                setDeletedName(deleteData.serviceName!);
            }).catch((err: Error) => {
                setDeployError(err.message);
            });
        }

        setShowDeleteModal(false);
        setDeleteData({});
        setConfirmName('');
    };

    const handleCreateDomain = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        setCreateDomainLoading(true);

        createServiceDomainFn({variables: {
            environmentId: domainData.environmentId!,
            serviceId: domainData.serviceId!,
            targetPort: parseInt(domainPort),
        }}).then(({data}) => {
            if (data) {
                setDomainCreated(data.serviceDomainCreate.domain);
            }
        }).catch((err: Error) => {
            setDeployError(err.message);
        }).finally(() => {
            setDomainPort('');
            setCreateDomainLoading(false);
            setShowCreateDomainModal(false);
        });
    };

    const instancesEls = instances.map((el) => {
        return (
            <tr key={el.serviceId}>
                <td>
                    {el.serviceName}
                </td>
                <td>
                    { el.sourceImage &&
                    <Link href={getDockerURL(el.sourceImage)} target='_blank' rel='noopener noreferrer'>{el.sourceImage}</Link>
                    }
                </td>
                <td>
                    { el.serviceDomain &&
                    <Link href={'https://'+el.serviceDomain} target='_blank' rel='noopener noreferrer'>{el.serviceDomain}</Link>
                    }
                </td>
                <td>
                    {el.status}
                </td>
                <td>
                    <Stack
                        spacing={1}
                        direction='row'
                    >

                        <Tooltip title='Show logs' variant='solid'>
                            <IconButton color='primary' variant='outlined' onClick={() => {
                                setDeploymentId(el.deploymentId!);
                                setShowLogsModal(true);
                            }}><TextSnippetIcon/></IconButton>
                        </Tooltip>

                        { !el.serviceDomain &&
                        <Tooltip title='Expose public domain' variant='solid'>
                            <IconButton color='primary' variant='outlined' onClick={() => {
                                setDomainData({environmentId: el.environmentId, serviceId: el.serviceId});
                                setShowCreateDomainModal(true);
                            }}><PublicIcon/></IconButton>
                        </Tooltip>
                        }

                        <Tooltip title='Delete service' variant='solid'>
                            <IconButton color='danger' variant='outlined' onClick={() => {
                                setDeleteData({projectId: el.projectId, serviceName: el.serviceName});
                                setShowDeleteModal(true);
                            }}><DeleteIcon/></IconButton>
                        </Tooltip>

                    </Stack>
                </td>
            </tr>
        );
    });

    return (
        <Stack
            direction='column'
            spacing={10}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '1%',
            }}
        >

            <Stack
                direction='column'
                spacing={2}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography level='h3'>
                    {`Hello ${me.name ?? me.username ?? me.email}!`}
                </Typography>

                <Stack
                    spacing={2}
                    direction='row'
                >
                    <Button onClick={() => { setShowDeployModal(true); }} startDecorator={<AddIcon/>}>
                        {'Deploy'}
                    </Button>

                    <Button onClick={handleLogOut} startDecorator={<LogoutIcon/>}>
                        {'Log out'}
                    </Button>
                </Stack>
            </Stack>


            { instances.length > 0 &&

            <Stack
                spacing={2}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography level='h3'>Services</Typography>

                <Table size='lg' sx={{width: '80%'}} variant='outlined' hoverRow={true}>
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Name</th>
                            <th style={{ width: '200px' }}>Image</th>
                            <th style={{ width: '300px' }}>Domain</th>
                            <th style={{ width: '120px' }}>Status</th>
                            <th style={{ width: '120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instancesEls}
                    </tbody>
                </Table>
            </Stack>
            }

            { instances.length === 0 &&
                <Typography level='body-lg'>
                    {'Looks like you don\'t have any services deployed.'}
                </Typography>
            }


            <Modal open={showDeployModal} onClose={() => { setShowDeployModal(false); setImage(''); setCreateLoading(false); }}>
                <ModalDialog>
                    <DialogTitle>Deploy a new service</DialogTitle>
                    <form
                        onSubmit={handleDeployService}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Image URI</FormLabel>
                                <Input autoFocus required placeholder='e.g., httpd' value={image} onChange={ev => { setImage(ev.target.value); }}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Service Name (optional)</FormLabel>
                                <Input placeholder='e.g., webserver' value={serviceName} onChange={ev => { setServiceName(ev.target.value); }}/>
                            </FormControl>

                            <Button type='submit' loading={createLoading}>Deploy</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>

            <Modal open={showDeleteModal} onClose={() => { setShowDeleteModal(false); setConfirmName(''); }}>
                <ModalDialog color='danger' role='alertdialog'>
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Delete service
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ maxWidth: 400 }}>
                            Are you sure you want to delete this service? Please type <Typography variant='soft'>{deleteData.serviceName}</Typography> to confirm.
                        </Typography>
                    </DialogContent>
                    <Input autoFocus required placeholder='Type service name in here' value={confirmName} onChange={(ev) => { setConfirmName(ev.target.value); }}/>
                    <DialogActions>
                        <Button variant='solid' color='danger' onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant='plain' color='neutral' onClick={() => { setShowDeleteModal(false); }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            <Modal open={showCreateDomainModal} onClose={() => { setShowCreateDomainModal(false); setDomainPort(''); setCreateDomainLoading(false); }}>
                <ModalDialog>
                    <DialogTitle>Expose service</DialogTitle>
                    <form
                        onSubmit={handleCreateDomain}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Port</FormLabel>
                                <Input
                                    slotProps={{
                                        input: {
                                            min: 80,
                                            max: 65535,
                                        },
                                    }}
                                    type='number' autoFocus required placeholder='e.g., 8080'value={domainPort} onChange={ev => { setDomainPort(ev.target.value); }}/>
                            </FormControl>
                            <Button type='submit' loading={createDomainLoading}>Expose</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>

            <Snackbar open={deletedName !== ''} color='success' variant='outlined' autoHideDuration={10000} onClose={() => { setDeletedName(''); }}>
                <Typography color='success'>Service <Typography fontWeight='lg'>{deletedName}</Typography> deleted successfully</Typography>
            </Snackbar>

            <Snackbar open={createdName !== ''} color='success' variant='outlined' autoHideDuration={10000} onClose={() => { setCreatedName(''); }}>
                <Typography color='success'>Service <Typography fontWeight='lg'>{createdName}</Typography> created successfully</Typography>
            </Snackbar>

            <Snackbar open={domainCreated !== ''} color='success' variant='outlined' autoHideDuration={10000} onClose={() => { setDomainCreated(''); }}>
                <Typography color='success'>Domain <Typography fontWeight='lg'>{domainCreated}</Typography> created successfully</Typography>
            </Snackbar>

            <Snackbar open={deployError !== ''} color='danger' variant='outlined' autoHideDuration={10000} onClose={() => { setDeployError(''); }}>
                <Typography color='danger'>{deployError}</Typography>
            </Snackbar>

            { showLogsModal &&
                <LogsModal deploymentId={deploymentId} onClose={() => { setShowLogsModal(false); }}/>
            }
        </Stack>
    );
}

function App() {
    const [auth, setAuth] = useState(false);

    return (
        <Stack>
            <Auth onAuth={() => { setAuth(true); }}/>
            { auth &&
            <Dashboard/>
            }
        </Stack>
    );
}

export default App;
