import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Badge, Alert } from 'react-bootstrap';

const allCountries = ['India', 'UAE', 'USA'];
const allStates = {
  India: ['Delhi', 'Maharashtra', 'Karnataka'],
  UAE: ['Dubai', 'Abu Dhabi'],
  USA: ['California', 'New York']
};
const allCities = {
  Delhi: ['New Delhi'],
  Maharashtra: ['Mumbai', 'Pune'],
  Karnataka: ['Bangalore', 'Mysore'],
  Dubai: ['Dubai City'],
  'Abu Dhabi': ['Abu Dhabi City'],
  California: ['Los Angeles', 'San Francisco'],
  'New York': ['New York City', 'Buffalo']
};

const GeoVisibilityToggle = () => {
  const [mode, setMode] = useState('include'); // 'include' or 'exclude'
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleToggle = (value, setter, current) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      mode,
      countries: selectedCountries,
      states: selectedStates,
      cities: selectedCities,
    };
    console.log('📦 Visibility Rules:', payload);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4">🌍 Multi-City / Country Visibility Toggle</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label><strong>Visibility Mode:</strong></Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              name="mode"
              label="✅ Show Only In These Locations"
              checked={mode === 'include'}
              onChange={() => setMode('include')}
            />
            <Form.Check
              inline
              type="radio"
              name="mode"
              label="🚫 Hide From These Locations"
              checked={mode === 'exclude'}
              onChange={() => setMode('exclude')}
            />
          </div>
        </Form.Group>

        {/* Country Selector */}
        <Form.Group className="mb-3">
          <Form.Label><strong>Countries:</strong></Form.Label>
          <div>
            {allCountries.map((country) => (
              <Badge
                key={country}
                pill
                bg={selectedCountries.includes(country) ? 'primary' : 'secondary'}
                className="me-2 mb-2 cursor-pointer"
                onClick={() => handleToggle(country, setSelectedCountries, selectedCountries)}
              >
                {country}
              </Badge>
            ))}
          </div>
        </Form.Group>

        {/* State Selector */}
        <Form.Group className="mb-3">
          <Form.Label><strong>States:</strong></Form.Label>
          <div>
            {selectedCountries.flatMap((country) =>
              allStates[country] || []
            ).map((state) => (
              <Badge
                key={state}
                pill
                bg={selectedStates.includes(state) ? 'primary' : 'secondary'}
                className="me-2 mb-2 cursor-pointer"
                onClick={() => handleToggle(state, setSelectedStates, selectedStates)}
              >
                {state}
              </Badge>
            ))}
          </div>
        </Form.Group>

        {/* City Selector */}
        <Form.Group className="mb-3">
          <Form.Label><strong>Cities:</strong></Form.Label>
          <div>
            {selectedStates.flatMap((state) =>
              allCities[state] || []
            ).map((city) => (
              <Badge
                key={city}
                pill
                bg={selectedCities.includes(city) ? 'primary' : 'secondary'}
                className="me-2 mb-2 cursor-pointer"
                onClick={() => handleToggle(city, setSelectedCities, selectedCities)}
              >
                {city}
              </Badge>
            ))}
          </div>
        </Form.Group>

        <Button variant="success" type="submit">
          ✅ Save Visibility Rules
        </Button>

        {success && (
          <Alert variant="success" className="mt-3">
            ✅ Visibility rules saved successfully!
          </Alert>
        )}
      </Form>
    </Container>
  );
};

export default GeoVisibilityToggle;
