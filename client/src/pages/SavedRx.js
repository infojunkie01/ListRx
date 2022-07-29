import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_RX } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeRxId } from '../utils/localStorage';

const SavedRx = () => {

    const [removeRx, { error }] = useMutation(REMOVE_RX);

    const { loading, data } = useQuery(GET_ME);

    const userData = data?.me || {};


    // create function that accepts the rx's mongo _id value as param and deletes the rx from the database
    const handleDeleteRx = async (rxId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }
        console.log(rxId)

        try {
            const { data } = await removeRx({
                variables: { rxId }
            });
            
            // upon success, remove rx's id from localStorage
            removeRxId(rxId);
        } catch (err) {
            console.error(err);
        }
    };

    // if data isn't here yet, say so
    if (loading) {
        return <h2>LOADING...</h2>;
    }

    return (
        <>
            <Jumbotron fluid className='text-light bg-primary'>
                <Container>
                    <h1>My prescriptions</h1>
                </Container>
            </Jumbotron>
            <Container>
                <h2 className="mb-3">
                    {userData.savedRx?.length
                        ? `Viewing ${userData.savedRx.length} saved ${userData.savedRx.length === 1 ? 'prescription' : 'prescription'}:`
                        : 'You have no saved prescriptions'}
                </h2>
                <CardColumns>
                    {userData.savedRx?.map((rx) => {
                        return (
                            <Card key={rx.rxId} border='dark'>
                                {rx.image ? <Card.Img src={rx.image} alt={`The cover for ${rx.title}`} variant='top' /> : null}
                                <Card.Body>
                                    <Card.Title className="text-capitalize">
                                        <h4 className='rx-name mb-2'>{rx.brandName}</h4>
                                    </Card.Title>
                                    <Card.Text>
                                        <p className="">Form: {rx.dosageForm}, ({rx.route})</p>
                                    </Card.Text>
                                    <Button className='btn-block btn-light btn-outline-danger' onClick={() => handleDeleteRx(rx.rxId)}>
                                        delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardColumns>
            </Container>
        </>
    );
};

export default SavedRx;
