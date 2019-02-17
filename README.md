# Simple Banking Webapp

Implemented with

- TypeScript
- Node.js
- Express
- Cloud Firestore
- Jest (for testing)

## Start locally

### Download and Install packages

```bash
git clone git@github.com:moriyuu/simple-banking-webapp.git
cd simple-banking-webapp
yarn install
```

### Set firebase serviceAccountKey

1. Create service account secret key (JSON) in Firebase console
1. Save the key as `src/serviceAccountKey.json`

### Build and Serve locally

```bash
yarn build
yarn serve
```

Finally, stop with `yarn stop` (or `yarn delete`).
