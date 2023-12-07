import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./../img/Nouveau Health-logos_white.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarText,
  NavItem,
  NavLink,
  Container,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
  CardGroup,
  CardImg,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Row,
} from "reactstrap";

const items = [
  {
    src: "https://picsum.photos/id/123/1200/400",
    altText: "Patient",
    caption: "Patient",
    key: 1,
  },
  {
    src: "https://picsum.photos/id/456/1200/400",
    altText: "Doctor",
    caption: "Doctor",
    key: 2,
  },
  {
    src: "https://picsum.photos/id/678/1200/400",
    altText: "Insurance Provider",
    caption: "Insurance Provider",
    key: 3,
  },
];

export default function Root(args) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  // const slides = items.map((item) => {
  //   return (
  //     <CarouselItem
  //       onExiting={() => setAnimating(true)}
  //       onExited={() => setAnimating(false)}
  //       key={item.src}
  //     >
  //       <img src={item.src} alt={item.altText} style={{width: "100%"}} />
  //       <CarouselCaption
  //         captionText={item.caption}
  //         captionHeader={item.caption}
  //       />
  //     </CarouselItem>
  //   );
  // });

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} style={{ width: "100%" }} />
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
        <div
          style={{
            position: "absolute",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            color="primary"
            onClick={() => handleButtonClick(item.caption)}
          >
            Login
          </Button>
        </div>
      </CarouselItem>
    );
  });

  function handleButtonClick(caption) {
    // navigate("/login");
    navigate("/login", { state: { caption } });
  }

  function handleClick() {
    navigate("/registration");
  }
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">
          <img
            alt="NV Logo"
            src={logo}
            style={{
              height: 60,
              width: 60,
            }}
          />
          Nouveau Health
        </NavbarBrand>
        {/* <NavItem>
          <NavLink href="/login">
            <NavbarText>Login</NavbarText>
          </NavLink>
        </NavItem> */}
      </Navbar>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        {...args}
      >
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
      <Container>
        <div
          // style={{
          //   justifyContent: "center",
          //   textAlign: "center",
          // }}
          style={{
            position: "absolute",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Row>
            <h1>Join Us Today</h1>
          </Row>
          <Row>
            <Button onClick={handleClick}>Register</Button>
          </Row>
        </div>
      </Container>
      {/* <div id="sidebar">
          <h1>React Router Testings push</h1>
          <div>
            <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search "
                placeholder="Search"
                type="search"
                name="q"
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </form>
            <form method="post">
              <button type="submit">New</button>
            </form>
          </div>
        </div>
        <div id="detail"></div> */}
    </>
  );
}
