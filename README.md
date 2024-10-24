<h1 align="center">
  <br>
  Railway API PoC
  <br>
</h1>
<h4 align="center">A basic PoC using <a href="https://railway.app/">Railway</a> GQL API to create and manage arbitrary services.</h4>
<br>

### Requirements

- NodeJS >= 20.11
- [Vite](https://vite.dev/) >= 5.4.x
- A way to proxy Railway GQL API (e.g. [Caddy](https://caddyserver.com/))

### Development

#### Install dependencies:

```
npm i
```

#### Proxy Railway GQL API

```
caddy reverse-proxy --from :9045 --to https://backboard.railway.app --header-up "Host: backboard.railway.app" --header-down "Access-Control-Allow-Origin: http://localhost:5173"
```

#### Run the development server:

```
npm run dev
```


