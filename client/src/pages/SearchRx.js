import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import Auth from '../utils/auth';
import { SAVE_RX } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import { saveRxId, getSavedRxId } from '../utils/localStorage';

const SearchRx = () => {
  // create state for holding returned google api data
  const [searchedRx, setSearchedRx] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  //const [showAlert, setShowAlert] = useState(false);

  // create state to hold saved rxId values
  const [savedRxId, setSavedRxId] = useState(getSavedRxId());

  const [saveRx, { error }] = useMutation(SAVE_RX);

  // set up useEffect hook to save `savedRxId` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveRxId(savedRxId);
  }, [error]);

  // create method to search for rx and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(`https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:${searchInput}`);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { results } = await response.json();

      // Removes discontinued prescriptions
      const filteredResults = results[0].products.filter(item =>
        item.marketing_status == "Prescription"
      )

      // Gets data from api
      const rxData = filteredResults.map((rx) =>
      ({
        rxId: rx.product_number,
        brandName: rx.brand_name,
        dosageForm: rx.dosage_form.toLowerCase(),
        route: rx.route.toLowerCase(),
      })
      );
      setSearchedRx(rxData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a rx to our database
  const handleSaveRx = async (rxId) => {
    // find the rx in `searchedRx` state by the matching id
    const rxToSave = searchedRx.find((rx) => rx.rxId === rxId);
    console.log('rxToSave', rxToSave)
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      console.log('rxToSave', rxToSave)
      const { data } = await saveRx({
        variables: {
          rx: { ...rxToSave }
        }
      });

      // if rx successfully saves to user's account, save rx id to state
      setSavedRxId([...savedRxId, rxToSave.rxId]);
      console.log("saved!")
    } catch (err) {
      console.error(err);
      console.log("not!")
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-primary'>
        <Container>
          <h1>Search for prescription by brand</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a prescription'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg' className="btn-warning">
                  search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h3 className="mb-3">
          {searchedRx.length
            ? `Viewing ${searchedRx.length} results:`
            : ''}
        </h3>
        <CardColumns>
          {searchedRx.map((rx) => {
            return (
              <Card key={rx.rxId} border='dark'>
                <Card.Body>
                  <Card.Title className="text-capitalize">
                    <h4 className='rx-name mb-2'>{rx.brandName}</h4>
                  </Card.Title>
                  <Card.Text>
                    <p className="">Form: {rx.dosageForm}, ({rx.route})</p>
                  </Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      className='btn-info btn-light btn-outline-primary'
                      onClick={() => {
                        handleSaveRx(rx.rxId)
                      }}>
                      {savedRxId?.some((savedRxId) => savedRxId === rx.rxId)
                        ? 'This prescription has already been saved!'
                        : 'save to my prescriptions'}
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

export default SearchRx;
