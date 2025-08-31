# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
## Environment Variables

### Waitlist Page Configuration

The Waitlist page requires the following environment variable to be set:

```
VITE_PUBLIC_WAITLIST_ENDPOINT=https://api.example.com/waitlist
```

This variable specifies the endpoint where waitlist submissions will be sent. The expected payload format is:

```json
{
  "email": "user@example.com",
  "consent": true,
  "source": "waitlist",
  "url": "https://example.com/waitlist",
  "createdAt": "2025-08-31T05:29:42.788Z"
}
```

The endpoint should respond with a 2xx status code for successful submissions.
