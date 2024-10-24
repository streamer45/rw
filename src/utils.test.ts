import {describe, expect, test} from '@jest/globals';
import {getDockerURL} from './utils';

describe('getDockerURL', () => {
    test('no repo', () => {
        expect(getDockerURL('httpd')).toBe('https://hub.docker.com/_/httpd');
    });

    test('with repo', () => {
        expect(getDockerURL('ubuntu/prometheus')).toBe('https://hub.docker.com/r/ubuntu/prometheus');
    });
});
