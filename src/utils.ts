export function getDockerURL(image: string) {
    const baseURL = 'https://hub.docker.com';
    if (image.includes('/')) {
        return `${baseURL}/r/${image}`;
    } else {
        return `${baseURL}/_/${image}`;
    }
}

