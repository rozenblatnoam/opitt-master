import { Button, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableData from './TableData'
import ChipInput from 'material-ui-chip-input';
import Title from './Title'
import {useState, useEffect} from 'react'

const Cars = () => {

    const mdTheme = createTheme({direction: 'rtl'});

    const [parkingNumbers, setParkingNumbers] = useState([])

    return (
        <>
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: 'flex' }}>
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Title>דף רכב</Title>
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
                                            plate: '',
                                            manufacturer: ''
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
                                                    label="בעלים"
                                                    name="owner"
                                                    disabled
                                                />
                                                <br /><br />
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="לוחית רישוי"
                                                    name="plate"
                                                />
                                                <br /><br />
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="יצרן"
                                                    name="manufacturer"
                                                />
                                                <br /><br />
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
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 320, overflow: 'auto' }}>
                                <TableData title="נהגים" element="users" />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </ThemeProvider> 
        </>
    )
}

export default Cars
