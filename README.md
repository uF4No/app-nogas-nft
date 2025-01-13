# ZKsync SSO React Template

[![Netlify Status](https://api.netlify.com/api/v1/badges/0ec0140b-9894-4d39-a688-ff572042ac45/deploy-status)](https://app.netlify.com/sites/zksync-sso-react/deploys)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/zksync-sso-light.png">
  <source media="(prefers-color-scheme: light)" srcset="public/zksync-sso-dark.png">
  <img alt="ZKsync SSO Logo" src="public/zksync-sso-dark.png">
</picture>

> This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).

See the [demo](https://zksync-sso-react.netlify.app/)

## Getting Started

1. Clone the repository
2. Run `bun install`
3. Run `bun run dev`

## Features

- Authentication with `zksync-sso`
- Dark/light theme selection with `next-themes`
- Responsive design
- Account page with balance and account type (EOA/Smart)

## TODO

- [x] Fix for mobile screens sizes
- [x] Replace emojis with icons 
- [x] Fix balance in account page
- [x] Improve navbar design

## Notes

- This template is using `React` and `Next.js`.
- This template is using `wagmi` and `viem` for the blockchain interaction.
- This template is using `zksync-sso` for the authentication and wallet connection.
- This template is using ZKsync Testnet as the default chain but can be changed to any other chain supported by `viem`.
- This template is using `tailwindcss` for the styling.
