import {
  Button,
  Caption,
  Div,
  Gallery,
  Panel,
  PanelProps,
  Title,
} from "@vkontakte/vkui";
import { FC, useState } from "react";
import astra from "../../../assets/astra.jpeg";
import provorniy from "../../../assets/provorniy.jpeg";
import germes from "../../../assets/germes.jpeg";
import styled from "styled-components";
import { useRouter } from "react-router5";

interface SlideProps {
  title: string;
  headline: string;
  image: string;
}
const slides: SlideProps[] = [
  {
    title: "Мы — СТУДОТРЯДЫ",
    headline: "Лучшее молодежное движение в стране",
    image: astra,
  },
  {
    title: "Не только работа!",
    headline: "Работа летом, мероприятия — круглый год",
    image: provorniy,
  },
  {
    title: "Хочешь стать бойцом?",
    headline: "Заполняй анкету и приходи на первое собрание!",
    image: germes,
  },
];

const ImageContainer = styled.div`
  pointerevents: none;
  height: 50vh;
  max-height: 450px;
  position: relative;

  img {
    display: block;
    object-fit: cover;
    object-position: left;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }
  .image-container-gradient {
    background: linear-gradient(
      180deg,
      transparent,
      var(--background_content) 100%,
      var(--background_content)
    );
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

const GalleryContainer = styled.div`
  flex: 1;
  display: flex;
  .vkuiGallery__bullets {
    top: 47vh !important;
  }
`;

const Slide: FC<SlideProps> = ({ image, title, headline }) => (
  <div>
    <ImageContainer>
      <img src={image} height={"100%"} alt={title} />
      <div className="image-container-gradient" />
    </ImageContainer>
    <div
      style={{
        paddingTop: 25,
        width: "100%",
      }}
    >
      <Title level="1" weight="bold">
        {title}
      </Title>
      <Caption
        style={{ marginTop: "12px", opacity: 0.7 }}
        level="1"
        weight="regular"
      >
        {headline}
      </Caption>
    </div>
  </div>
);
export const OnBoardingPanel: FC<PanelProps> = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const { navigate } = useRouter();
  const onApply = () => {
    navigate("init.apply");
  };

  return (
    <Panel
      {...props}
      style={{
        textAlign: "center",
      }}
    >
      <GalleryContainer>
        <Gallery
          slideIndex={slideIndex}
          onChange={setSlideIndex}
          slideWidth="100%"
          align="right"
          bullets="light"
          showArrows={true}
        >
          {slides.map((slide) => (
            <Slide key={slide.title} {...slide} />
          ))}
        </Gallery>
      </GalleryContainer>

      {slideIndex === slides.length - 1 ? (
        <Div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
          }}
        >
          <Button
            onClick={onApply}
            style={{ marginTop: 16 }}
            stretched
            size="l"
          >
            Заполнить анкету
          </Button>
        </Div>
      ) : (
        <Div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
          }}
        >
          <Button
            mode="tertiary"
            size="s"
            onClick={() => setSlideIndex(slides.length - 1)}
          >
            Пропустить
          </Button>
        </Div>
      )}
    </Panel>
  );
};
