import { Box, Button, Card, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import '@fontsource/prompt'; 
import logo from '../../../../public/icon.png';
import logoele from '../../../../public/logoele.png';
import Image from "next/image";
import Link from 'next/link';

function Page(status) {
  const CmuentraidURL = process.env.CMU_ENTRAID_URL as string;
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#8F16AD', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ margin: 0, borderRadius: 4, width: '100%', maxWidth: '500px', textAlign: 'center' }}>
              <Box sx={{ margin: 4 }}>
                {/* Title */}
                <Typography variant="h5" sx={{ fontFamily: 'Prompt', fontWeight: 'bold',color:'#8F16AD' }}>
                  Checkchue
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center',padding:2}}>
                    <Image src={logo} alt="Logo" width={200} height={200} priority />
                </Box>
                

                {/* Login Button with LogoEle Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Link href={`${CmuentraidURL}`}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#BF48DD', display: 'flex', alignItems: 'center', gap: 1, padding: '8px 16px' }}
                  >
                    <Image src={logoele} alt="LogoEle" width={30} height={30} priority />
                    <Typography
                      sx={{
                        fontSize: {xs: 14, sm: 16 ,md: 18},
                        fontFamily: 'Prompt',
                        fontWeight: 'medium',
                        color: '#fff',
                      }}
                    >
                      Login with CMU account
                    </Typography>
                  </Button>
                  </Link>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Page;
