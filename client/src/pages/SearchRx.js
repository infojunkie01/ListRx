import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import Auth from '../utils/auth';
import { SAVE_RX } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import { saveRxIds, getSavedRxIds } from '../utils/localStorage';

const SearchRxs = () => {
  // create state for holding returned google api data
  const [searchedRxs, setSearchedRxs] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  //const [showAlert, setShowAlert] = useState(false);

  // create state to hold saved rxId values
  const [savedRxIds, setSavedRxIds] = useState(getSavedRxIds());

  const [saveRx, { error }] = useMutation(SAVE_RX);

  // set up useEffect hook to save `savedRxIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveRxIds(savedRxIds);
  }, [error]);

  // create method to search for rx and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(`https://api.fda.gov/drug/drugsfda.json?search=openfda.brand_name:${searchInput}`);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const rxData = items.map((rx) => ({
        rxId: rx.id,
        // authors: rx.volumeInfo.authors || ['No author to display'],
        // title: rx.volumeInfo.title,
        // description: rx.volumeInfo.description,
        // image: rx.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedRxs(rxData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a rx to our database
  const handleSaveRx = async (rxId) => {
    // find the rx in `searchedRxs` state by the matching id
    const rxToSave = searchedRxs.find((rx) => rx.rxId === rxId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // console.log(rxToSave);
      const { data } = await saveRx({
        variables: {
          rx: { ...rxToSave }
        }
      });

      // if rx successfully saves to user's account, save rx id to state
      setSavedRxIds([...savedRxIds, rxToSave.rxId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Rx!</h1>
          <Form onSubmit={handleFormSubmit}>
            {/* <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your rx search!
        </Alert> */}
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a rx'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedRxs.length
            ? `Viewing ${searchedRxs.length} results:`
            : 'Search for a rx to begin'}
        </h2>
        <CardColumns>
          {searchedRxs.map((rx) => {
            return (
              <Card key={rx.rxId} border='dark'>
                {rx.image ? (
                  <Card.Img src={rx.image} alt={`The cover for ${rx.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{rx.title}</Card.Title>
                  <p className='small'>Authors: {rx.authors}</p>
                  <Card.Text>{rx.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      // disabled={savedRxIds?.some((savedRxId) => savedRxId === rx.rxId)}
                      className='btn-block btn-info'
                      onClick={() => {
                        // console.log(rx.rxId)
                        handleSaveRx(rx.rxId)

                      }}>
                      {savedRxIds?.some((savedRxId) => savedRxId === rx.rxId)
                        ? 'This rx has already been saved!'
                        : 'Save this Rx!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchRxs;
