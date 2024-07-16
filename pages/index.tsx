import type { NextPage } from 'next';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Paper, Grid, Box, Button, LinearProgress, Link, Typography, } from '@mui/material';
import { CreateErc6551Account } from '../components/CreateErc6551Account';
import { Erc6551MintNft } from '../components/Erc6551MintNft';
import { ReadTbaNftBalance } from '../components/ReadTbaNftBalance';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import Erc721 from '../Contact/Erc721-demo.json'
import { use, useEffect, useState } from 'react';

const Home: NextPage = () => {
  const { address } = useAccount();
  const [nftBalance, setBalance] = useState<number | undefined>(undefined);

  const { data: balance, error, isLoading, isSuccess } = useContractRead({
    address: "0x8A45161bFB9c36748CCA23E251143d02cd7b540d",
    abi: Erc721.abi,
    functionName: 'balanceOf',
    args: [address], //fill in user wallet address 
    // test address: 0xE2c0f71ebe5F5F5E3600CA632b16c5e850183ddf
    onSuccess: (balance: number) => {
      setBalance(Number(balance));
      console.log('read balance success:', balance);
    }
  });

  const { write: mintFunction, data, error: useContractWriteError, isLoading: useContractWriteIsLoading, isError } = useContractWrite({
    address: "0xd060E336282bBF24D507f16EC9961EE677cc5915",
    abi: Erc721.abi,
    functionName: 'mint',
    args: [BigInt(1)],
    onSuccess: (data) => {
      console.log('mint success:', data);
    }
  });

  const { data: receipt, isLoading: isPending, isSuccess: useWaitForTransactionSuccess } = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    console.log(receipt);
    console.log(isPending);
    console.log(useWaitForTransactionSuccess);
  }, [isPending, receipt, useWaitForTransactionSuccess])

  useEffect(() => {
    console.log(nftBalance);
    if (nftBalance && nftBalance >= 2) {
      console.log('nftBalance >= 2', nftBalance);
    } else {
      console.log('nftBalance < 2', nftBalance);
    }

  }, [error, balance, nftBalance]);


  return (
    <main className="...">
      <Head>
        <title>lootex-mintPage-demo
        </title>
        <meta
          content="developer by Kevin & Owen"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', zIndex: '999' }}>
        <Paper
          sx={{
            width: '45%',
            padding: '2rem',
            maxHeight: '80vh',
            background: '#18131A',
            border: '2px solid #3E393E',
            borderRadius: '1rem',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
          }}>
          <Grid container direction={'column'} justifyContent="center" alignItems="center"
            gap={2}
          >
            <ConnectButton />
            <Box display="flex" justifyContent="space-between" mb={1} sx={{ width: '100%' }} >
              <Typography variant="body2" color="white">{(nftBalance ?? 0 / 2) * 100} %</Typography>
              <Typography variant="body2" color="white">{nftBalance} / 2</Typography>
            </Box>
            <Box sx={{ width: '100%' }} mb={1}>
              <LinearProgress variant="determinate" value={nftBalance} sx={{
                height: '10px', borderRadius: '23px', backgroundColor: 'grey.700',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FF0088'
                }
              }} />
            </Box>
            <Box p={2} bgcolor="grey.900" borderRadius={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="h6" color="white">Smart Mint for Smart Frens! Zero Gas Fee!</Typography>
              </Box>
              <Typography paragraph color="white">為了慶祝 Lootex Smart Account 正式登場，我們推出了這個限量 10K Free Mint 的 AI-generated NFT 系列。馬上按下 Smart Mint 按鈕，一起加入 ‘Smart Frens’ 的行列吧！😉</Typography>
              <ul>
                <Typography component="li" paragraph color="white">本活動僅限 Smart Account 帳戶參與，每個帳戶皆可 Mint 2 個 NFTs</Typography>
                <Typography component="li" paragraph color="white">本次活動的 Gas Fee 由 Mantle Network 贊助</Typography>
                <Typography component="li" paragraph color="white">Mint 期間 (UTC+8): 2024/01/31, 6 PM - Mint 完為止</Typography>
                <Typography component="li" color="white">宣佈將於 (UTC+8) 2024/02/16, 3 PM 開啟</Typography>
              </ul>
              <Box display="flex" justifyContent='center'>
                <Button variant="contained" color="secondary" disabled={!!(!address || nftBalance && nftBalance >= 2)}
                  sx={{
                    "&:disabled": {
                      backgroundColor: 'gray'
                    }
                  }}
                  onClick={() => mintFunction()}
                > Mint</Button>
              </Box>
            </Box>
            {/* <CreateErc6551Account />
            <Erc6551MintNft />
            <ReadTbaNftBalance /> */}
          </Grid>
        </Paper>
      </Box>
    </main >
  )
}

export default Home;
