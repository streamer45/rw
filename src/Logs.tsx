import Tabs from '@mui/joy/Tabs';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import TabList from '@mui/joy/TabList';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import LinearProgress from '@mui/joy/LinearProgress';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import Typography from '@mui/joy/Typography';

import { useQuery } from '@apollo/client';

import {GET_DEPLOYMENT_LOGS} from './queries';

function Logs({logs}: {logs: {message: string, severity?: string | null, timestamp: string}[]}) {
    if (logs.length === 0) {
        return (
            <Typography level='body-lg'>No logs available</Typography>
        );
    }

    const getColor = (severity: string) => {
        switch (severity) {
        case 'error':
            return 'danger';
        case 'warning':
        case 'warn':
            return 'warning';
        default:
            return 'neutral';
        }
    };

    return (
        <List
            sx={{overflow: 'auto', height: '80vh'}}
        >
            {
                logs.map((el, index) => {
                    const color = getColor(el.severity ?? '');
                    return (
                        <ListItem key={index} color='danger'>
                            <Typography level='body-sm' sx={{fontFamily: 'monospace'}} color={color}>{el.timestamp}</Typography>
                            <Typography level='body-sm' sx={{fontFamily: 'monospace'}} color={color}>{el.severity}</Typography>
                            <Typography level='body-sm' sx={{fontFamily: 'monospace'}} color={color}>{el.message}</Typography>
                        </ListItem>
                    );
                })
            }
        </List>
    );
}

export function LogsModal({deploymentId, onClose} : {deploymentId: string, onClose: () => void}) {
    const {data, loading} = useQuery(GET_DEPLOYMENT_LOGS, {
        variables: {deploymentId},
        pollInterval: 1000,
    });

    const deploymentLogs = data?.deploymentLogs ?? [];
    const buildLogs = data?.buildLogs ?? [];

    return (
        <Modal
            open={Boolean(deploymentId)}
            onClose={onClose}
        >
            <ModalDialog layout='fullscreen'>
                <ModalClose />
                <DialogTitle>Logs</DialogTitle>

                <Tabs aria-label='Logs' defaultValue={0}>
                    <TabList>
                        <Tab>Deployment logs</Tab>
                        <Tab>Build logs</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        { loading ?
                            <LinearProgress sx={{marginTop: '40vh'}} /> :
                            <Logs logs={deploymentLogs}/>
                        }
                    </TabPanel>
                    <TabPanel value={1}>
                        { loading ?
                            <LinearProgress sx={{marginTop: '40vh'}} /> :
                            <Logs logs={buildLogs}/>
                        }
                    </TabPanel>
                </Tabs>

            </ModalDialog>
        </Modal>
    );
}
