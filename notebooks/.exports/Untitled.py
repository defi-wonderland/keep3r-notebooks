#!/usr/bin/env python
# coding: utf-8

# In[1]:


abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_governance",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_keep3rHelper",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_keep3rV1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_keep3rV1Proxy",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_kp3rWethPool",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AlreadyAJob",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyAKeeper",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyDisputed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BondsLocked",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BondsUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Disputed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "DisputerExistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "DisputerUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientFunds",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientJobTokenCredits",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobAlreadyAdded",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobDisputed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobLiquidityInsufficient",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobLiquidityLessThanMin",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobLiquidityUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobMigrationImpossible",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobMigrationLocked",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobMigrationUnavailable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobTokenCreditsLocked",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobTokenInsufficient",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobTokenUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobUnapproved",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobUnavailable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "JobUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "KeeperAlreadyBlackListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "LiquidityPairApproved",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "LiquidityPairInvalid",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "LiquidityPairUnapproved",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "LiquidityPairUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MinRewardPeriod",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoGovernanceZeroAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotDisputed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlyDisputerOrGovernance",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlyGovernance",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlyJobOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlyPendingGovernance",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlyPendingJobOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlySlasherOrGovernance",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "SlasherExistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "SlasherUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TokenUnavailable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnbondsLocked",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnbondsUnexistent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ZeroAddress",
      "type": "error"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_bond",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "Activation",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_bondTime",
          "type": "uint256"
        }
      ],
      "name": "BondTimeChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_bonding",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "Bonding",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_jobOrKeeper",
          "type": "address"
        }
      ],
      "name": "Dispute",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_disputer",
          "type": "address"
        }
      ],
      "name": "DisputerAdded",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_disputer",
          "type": "address"
        }
      ],
      "name": "DisputerRemoved",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_pendingGovernance",
          "type": "address"
        }
      ],
      "name": "GovernanceProposal",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_governance",
          "type": "address"
        }
      ],
      "name": "GovernanceSet",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_inflationPeriod",
          "type": "uint256"
        }
      ],
      "name": "InflationPeriodChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_jobOwner",
          "type": "address"
        }
      ],
      "name": "JobAddition",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_fromJob",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "address",
          "name": "_toJob",
          "type": "address"
        }
      ],
      "name": "JobMigrationRequested",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_fromJob",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_toJob",
          "type": "address"
        }
      ],
      "name": "JobMigrationSuccessful",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_previousOwner",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "JobOwnershipAssent",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_pendingOwner",
          "type": "address"
        }
      ],
      "name": "JobOwnershipChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "JobRemoval",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        }
      ],
      "name": "JobSlash",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "JobSlashLiquidity",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "JobSlashToken",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_keep3rHelper",
          "type": "address"
        }
      ],
      "name": "Keep3rHelperChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_keep3rV1",
          "type": "address"
        }
      ],
      "name": "Keep3rV1Change",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_keep3rV1Proxy",
          "type": "address"
        }
      ],
      "name": "Keep3rV1ProxyChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        }
      ],
      "name": "KeeperRevoke",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "KeeperSlash",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_credit",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_gasUsed",
          "type": "uint256"
        }
      ],
      "name": "KeeperWork",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_kp3rWethPool",
          "type": "address"
        }
      ],
      "name": "Kp3rWethPoolChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_provider",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "LiquidityAddition",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        }
      ],
      "name": "LiquidityApproval",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_rewardedAt",
          "type": "uint256"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_currentCredits",
          "type": "uint256"
        }
      ],
      "name": "LiquidityCreditsReward",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_liquidityMinimum",
          "type": "uint256"
        }
      ],
      "name": "LiquidityMinimumChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        }
      ],
      "name": "LiquidityRevocation",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "LiquidityWithdrawal",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_jobOrKeeper",
          "type": "address"
        }
      ],
      "name": "Resolve",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_rewardPeriodTime",
          "type": "uint256"
        }
      ],
      "name": "RewardPeriodTimeChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        }
      ],
      "name": "SlasherAdded",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        }
      ],
      "name": "SlasherRemoved",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_provider",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "TokenCreditAddition",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        }
      ],
      "name": "TokenCreditWithdrawal",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_unbondTime",
          "type": "uint256"
        }
      ],
      "name": "UnbondTimeChange",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeperOrJob",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_unbonding",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "Unbonding",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "_bond",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "BASE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "FEE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_REWARD_PERIOD_TIME",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "acceptGovernance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_fromJob",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_toJob",
          "type": "address"
        }
      ],
      "name": "acceptJobMigration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "acceptJobOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_bonding",
          "type": "address"
        }
      ],
      "name": "activate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_disputer",
          "type": "address"
        }
      ],
      "name": "addDisputer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "addJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "addLiquidityToJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        }
      ],
      "name": "addSlasher",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "addTokenCreditsToJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        }
      ],
      "name": "approveLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "approvedLiquidities",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "_list",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_bonding",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "bond",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bondTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_payment",
          "type": "uint256"
        }
      ],
      "name": "bondedPayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "bonds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "canActivateAfter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "canWithdrawAfter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeJobOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "directTokenPayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_jobOrKeeper",
          "type": "address"
        }
      ],
      "name": "dispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "disputers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "disputes",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "firstSeen",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "forceLiquidityCreditsToJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "governance",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasBonded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "inflationPeriod",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_bond",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_minBond",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_earned",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        }
      ],
      "name": "isBondedKeeper",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        }
      ],
      "name": "isKeeper",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_minBond",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_earned",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        }
      ],
      "name": "isMinKeeper",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "jobLiquidityCredits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_liquidityCredits",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "jobOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "jobPendingOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "jobPeriodCredits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_periodCredits",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "jobTokenCredits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "jobTokenCreditsAddedAt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "jobs",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "_list",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "keep3rHelper",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "keep3rV1",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "keep3rV1Proxy",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "keepers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "_list",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "kp3rWethPool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "lastJob",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "liquidityAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "liquidityMinimum",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_fromJob",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_toJob",
          "type": "address"
        }
      ],
      "name": "migrateJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        }
      ],
      "name": "observeLiquidity",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int56",
              "name": "current",
              "type": "int56"
            },
            {
              "internalType": "int56",
              "name": "difference",
              "type": "int56"
            },
            {
              "internalType": "uint256",
              "name": "period",
              "type": "uint256"
            }
          ],
          "internalType": "struct IKeep3rJobFundableLiquidity.TickCache",
          "name": "_tickCache",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "pendingBonds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pendingGovernance",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "pendingJobMigrations",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "pendingUnbonds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "quoteLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_periodCredits",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_disputer",
          "type": "address"
        }
      ],
      "name": "removeDisputer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "removeJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_slasher",
          "type": "address"
        }
      ],
      "name": "removeSlasher",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_jobOrKeeper",
          "type": "address"
        }
      ],
      "name": "resolve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        }
      ],
      "name": "revoke",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        }
      ],
      "name": "revokeLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardPeriodTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "rewardedAt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bondTime",
          "type": "uint256"
        }
      ],
      "name": "setBondTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_governance",
          "type": "address"
        }
      ],
      "name": "setGovernance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_inflationPeriod",
          "type": "uint256"
        }
      ],
      "name": "setInflationPeriod",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keep3rHelper",
          "type": "address"
        }
      ],
      "name": "setKeep3rHelper",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keep3rV1",
          "type": "address"
        }
      ],
      "name": "setKeep3rV1",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keep3rV1Proxy",
          "type": "address"
        }
      ],
      "name": "setKeep3rV1Proxy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_liquidityMinimum",
          "type": "uint256"
        }
      ],
      "name": "setLiquidityMinimum",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_rewardPeriodTime",
          "type": "uint256"
        }
      ],
      "name": "setRewardPeriodTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_unbondTime",
          "type": "uint256"
        }
      ],
      "name": "setUnbondTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_kp3rWethPool",
          "type": "address"
        }
      ],
      "name": "setkp3rWethPool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_bonded",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "slash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "slashJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "slashLiquidityFromJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "slashTokenFromJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "slashers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        }
      ],
      "name": "totalJobCredits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_credits",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_bonding",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "unbond",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "unbondLiquidityFromJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unbondTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_bonding",
          "type": "address"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_liquidity",
          "type": "address"
        }
      ],
      "name": "withdrawLiquidityFromJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_job",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        }
      ],
      "name": "withdrawTokenCreditsFromJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "workCompleted",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        }
      ],
      "name": "worked",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "workedAt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]


# In[2]:


events = [x for x in abi if x.get('type') == 'event']


# In[3]:


e = events[0]


# In[12]:


s = ''

for e in events:
    s += 'Table ' + e.get('name') + ' {\n'

    for i in [(e.get('name'),e.get('type')) for e in e.get('inputs')]:
        s += i[0] + ' ' + i[1] + ' \n'
    s += '} \n'


# In[13]:


print(s)


# In[ ]:




