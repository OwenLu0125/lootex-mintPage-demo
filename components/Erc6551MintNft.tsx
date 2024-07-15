import { useEffect, useState } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import ERC6551Account from '../Contact/ERC6551Account.json'
import { Box, Button, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import nftABI from '../Contact/Nft-abi.json'

export function Erc6551MintNft() {
  const [ethersData, setEthersData] = useState<string>('');
  const [ERC6551AccountWallet, setERC6551AccountWallet] = useState<any>('');
  const [nftContractAddress, setNftContractAddress] = useState<any>('0x8A45161bFB9c36748CCA23E251143d02cd7b540d');

  const { write: mintFunction, data, error, isLoading, isError } = useContractWrite({
    address: ERC6551AccountWallet, // fill in the tba address
    // 0x91c3acbd0c22d0ebd751939b3777aee5d7ac1ed3
    abi: ERC6551Account.abi,
    functionName: 'execute',
    args: [
      '0x8A45161bFB9c36748CCA23E251143d02cd7b540d', // fill in the nft contract address
      0,
      ethersData,
      0,
    ]
  });
  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    try {
      console.log(data);
      console.log(error);
      console.log(isLoading);
      console.log(isError);
      console.log(receipt); // receipt is the transaction receipt
      console.log(isPending);
      console.log(isSuccess);
      console.log(ethersData);
    } catch (error) {
      console.error(error);
    }
  }, [data, error, isError, isLoading, isPending, isSuccess, receipt, ethersData])

  useEffect(() => {
    const getData = async () => {
      try {
        const iface = new ethers.utils.Interface(nftABI);
        const functionName = "mint";
        const params = [1];
        const data = iface.encodeFunctionData(functionName, params);
        console.log(data);
        setEthersData(data);
      } catch (error) {
        console.error("錯誤捕獲:", error);
      }
    }
    getData();
  }, []);


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
        }}
      >
        <Typography
          variant='h5'
          sx={{
            color: 'white'
          }}>
          use erc6551 mint nft:
        </Typography>
        <TextField fullWidth label="erc6551 address" id="addInput"
          InputLabelProps={{ style: { color: 'white' } }}
          color='secondary'
          sx={{
            mb: '15px',
            mt: '15px',
          }}
          inputProps={{
            style: { color: 'white' },
          }}
          value={ERC6551AccountWallet}
          onChange={(e) => setERC6551AccountWallet(e.target.value)}
        />
        <TextField fullWidth label="NFT contract address" id="addInput"
          InputLabelProps={{ style: { color: 'white' } }}
          color='secondary'
          sx={{
            mb: '15px',
            mt: '15px',
          }}
          inputProps={{
            style: { color: 'white' },
          }}
          value={nftContractAddress}
          onChange={(e) => setNftContractAddress(e.target.value)}
        />
        <Button fullWidth variant="contained" onClick={() => mintFunction()}>
          Mint
        </Button>
        {isPending && <div>
          <Typography
            sx={{
              color: 'white',
            }}
          >
            Pending...
          </Typography>
        </div>
        }
        {receipt && <div>
          <Typography
            sx={{
              color: 'white',
            }}
          >{receipt.transactionHash}
          </Typography>
        </div>}
        {isError && error &&
          <Typography
            sx={{
              color: 'purple',
            }}
          >
            {error.toString()}
          </Typography>
        }
      </Box>
    </>
  );
}