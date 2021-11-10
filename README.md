# Wonderland Notebooks

A Jupyter Notebook environment for E2E graphical testing.

## Requirements

- Python 3
- Node (version?)

## Get Started

1. Execute `yarn install`
1. Execute `yarn jupyter:install`
1. Execute `yarn jupyter`
1. Open `http://localhost:8888/` if not automatically redirected
1. Select `Node.js` as kernel to run all `00-setup.ipynb`
1. Open another notebook and select:
   `Navigation bar > Kernel > Change kernel... > 00-setup.ipynb`
1. Re-run `00-setup.ipynb` to restart the environment
1. Execute `yarn jupyter:kill` to terminate the Jupyter environment

### Notebooks utils

- `fetch(abi, address)`: gets contract at address
- `deploy(abi, parameters)`: deploys contract
- `addViewTrace(contract, viewName, viewArgument, traceName)`: registers a view result to be recorded
- `addEventTrace(contract, eventName, timestampIndexArgument)`: registers an event log to be recorded
- **TODO**: `addScriptTrace()`
- `sleep(time)`: advances time
- `sleepAndRecord(timeToSleep, recordEvery)`: advances time and records traces
- `sleepAndExecute(timeToSleep, recordEvery, [{run, every}])`: advances time and records traces while executing a function
