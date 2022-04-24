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

const UserSingle = () => {

    const mdTheme = createTheme({direction: 'rtl'});

    const [parkingNumbers, setParkingNumbers] = useState([])

    return (
        <>
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: 'flex' }}>
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Title>דף משתמש</Title>
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
                                            fname: '',
                                            lname: '',
                                            phone: '',
                                            parkingNumbers: parkingNumbers
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
                                                    label="שם פרטי"
                                                    name="fname"
                                                />
                                                <br /><br />
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="שם משפחה"
                                                    name="lname"
                                                />
                                                <br /><br />
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="מספר נייד"
                                                    name="phone"
                                                />
                                                <br /><br />
                                                <Field
                                                    component={ChipInput}
                                                    type="text"
                                                    label="רשימת חניות"
                                                    name="parkingNumbers"
                                                    style={{direction: "ltr"}}
                                                    variant="outlined"
                                                    onChange={(chips) => setParkingNumbers(chips)}
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
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 320, overflow: 'auto', mb: 6.3 }}>
                                <TableData title="רכבים" element="cars" />
                                </Paper>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 320, overflow: 'auto' }}>
                                <TableData title="מורשים" element="users" />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </ThemeProvider> 
        </>
    )
}

export default UserSingle
