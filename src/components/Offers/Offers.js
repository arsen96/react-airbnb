import React, { useRef} from 'react';
import './Offers.css';
import L from 'leaflet';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
const readFullText = (props,item) => {
  const saved = [...props.airbnbs];
  item.all = !item.all;
  props.setAirbnbs(saved)
}



const Offers = (props) => {
 const citySearchRef = useRef();
 const minPrixRef = useRef(null);
 const maxPrixRef = useRef(null);


const getUserLocation = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(position) {
    const crd = position.coords;
    const lat = crd.latitude;
    const long = crd.longitude;
    props.getUserLocation({lat,long});
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

const zoomIn = (item) => {
  props.zoomToZone(item);
}

const handleSubmit = (event) =>{
  event.preventDefault();
  const min = Number(minPrixRef.current.value);
  const max = Number(maxPrixRef.current.value);
  let city = citySearchRef.current.value;
  props.search({min,max,city});
  citySearchRef.current.value = ""
  minPrixRef.current.value = ""
  maxPrixRef.current.value = ""
}

  return (
  <div className="Offers">
 

    <Form className="price-search"  onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Control type="text" placeholder="Saisissez une ville" ref={citySearchRef} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
        <Form.Control type="text" ref={minPrixRef} placeholder="Min €" />
      </Form.Group>
      -
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
        <Form.Control type="text" ref={maxPrixRef} placeholder="Max €" />
      </Form.Group>
      <Button variant="primary" className="btn-price" type="submit">Valider</Button>
    </Form>
    <div className="closeToOffers">
    <Button variant="warning" onClick={(e) => getUserLocation()}>Les offres les plus proches</Button>
    </div>
    <div className="searchSideView">
      <div className="searchBar"></div>
    </div>
       <Row md={2}>
        {props.airbnbs.filter((item) => !item.hide)?.length === 0 && <div className="no-found"><Badge bg="danger" ><h5>Aucun résultat trouvé</h5></Badge></div> }
        {props.airbnbs.map((item,index) => (  
            <Col key={index} className={`justify-content-center ${item.hide === true ? 'hideItem' : 'visibleItem'}`} 
            onTransitionEnd={e => {
                e.target.style.position = item.hide === true ? "fixed" : "initial"
            }}>
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={`https://api.slingacademy.com/public/sample-photos/${item.id}.jpeg`} />
                <Card.Body>
                  <Card.Title>{item.title}({item.city})</Card.Title>
                  <div class="cardData">
                    <Badge pill bg={item.price < 80  ? 'success' : item.price > 80 &&  item.price < 160 ? 'warning' : 'danger'}>
                    {item.price} €
                    </Badge>
                     <Button variant="light" onClick={(e) => zoomIn(item)}>Voir</Button>
                  </div>
                  
                  <Card.Text className={!item.all ? 'hidden' : 'show'}>
                  {
                    item.description
                  }
                  </Card.Text>
                  <div class="buttons">
                    <Button variant="light" onClick={(e) => readFullText(props,item)}>{!item.all ? 'Lire la suite' : 'Moins'}</Button>
                    {item.distance && <Button variant="primary">{item.distance}</Button>}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
  </div>
  )
}

Offers.propTypes = {};

Offers.defaultProps = {};

export default Offers;
