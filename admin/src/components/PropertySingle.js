import { Button, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableData from './TableData';
import Title from './Title';

const PropertySingle = () => {

    const mdTheme = createTheme({direction: 'rtl'});
    
    return (
        <>
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: 'flex' }}>
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Title>דף נכס</Title>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 690,
                                    }}
                                >
                                    <Formik
                                        initialValues={{
                                            address: '',
                                            usersAmount: '',
                                            buildingCommittee: ''
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            setTimeout(() => {
                                            setSubmitting(false);
                                            alert(JSON.stringify(values, null, 2));
                                            }, 500);
                                        }}
                                    >
                                        {({ submitForm, isSubmitting }) => (
                                            <Form>
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="כתובת"
                                                    name="address"
                                                />
                                                <br /><br />
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="מספר דיירים"
                                                    name="usersAmount"
                                                />
                                                <br /><br />
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="נציג ועד בית"
                                                    name="buildingCommittee"
                                                />
                                                {isSubmitting && <LinearProgress />}
                                                <br /><br />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isSubmitting}
                                                    onClick={submitForm}
                                                >
                                                    שמור שינויים
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>
                                </Paper>
                            </Grid>
                            <Grid item xs={9}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 690, overflow: 'auto' }}>
                                <TableData title="דיירים" element="users" addBtn />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </ThemeProvider> 
        </>
    )
}

export default PropertySingle