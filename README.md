# Jamboree

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

This project uses VSCode development containers to create reproducable environments, allowing the frontend service to communicate with the backend service.

First, create a Docker network:

```sh
$ docker network create
```

Then, use the Devcontainer CLI, or VSCode Devcontainer to extension to start the container:

```sh
$ devcontainer open /path/to/jamboree
```

Make sure you also have the [backend](https://github.com/Dan6erbond/jamboree-api) Devcontainer running for full functionality including schema downloading, and frontend functionality.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
